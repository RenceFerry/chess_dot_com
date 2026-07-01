'use server'

import z from 'zod';
import { loginSchema, signupSchema } from "@/_lib/zodSchema";
import type { StateAuthForm } from '../../../_lib/types';
import bcrypt from 'bcrypt';
import prisma from '@/_lib/prisma';
import { createSession } from '../../sessions';
import transporter from '@/_lib/brevo';
import { generateOTP } from '@/_utils/helpers';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import fs from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';
import gender from '@/_lib/genderApi';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const otpHTMLTemplateFilepath = path.join(__dirname, '../../../_lib/otp-email.html')
const otpHTMLTemplate = fs.readFileSync(otpHTMLTemplateFilepath, 'utf-8');


//login action
export const loginSA = async (initialState: StateAuthForm, formData: FormData): Promise<StateAuthForm> => {
  const data = Object.fromEntries(formData);

  const validatedData = loginSchema.safeParse(data);

  if (!validatedData.success) {
    const error = z.treeifyError(validatedData.error);
    return {
      error,
      payload: {
        ...data
      }
    }
  }

  const nameOrEmail = validatedData.data.nameOrEmail.trim();
  const formPassword = validatedData.data.password.trim();

  let user;
  const isEmail = nameOrEmail.includes('@');

  //get user in db
  if (isEmail) {
    try {
      user = await prisma.users.findUnique({
        where: {
          email: nameOrEmail
        },
        
      })
    } catch (e) {
      return { message: 'Server Error, try again later', payload: { ...data } };
    }
  } else {
    try {
      user = await prisma.users.findUnique({
        where: {
          name: nameOrEmail
        }
      })
    } catch (e) {
      return { message: 'Server error, try again later', payload: { ...data } };
    }
  }

  //check if user exist
  if (!user) {
    return {
      message: "Account doesn't Exist, Create one!", payload: { ...data } 
    }
  }

  const { id, password: userPassword, name } = user;
  //check if user sign up using google
  if (!userPassword) {
    return {
      message: 'You signed up using google, use it to log in and set a password after logging in', payload: { ...data }
    }
  }

  console.log('check')

  //validate password
  const valid = await bcrypt.compare(formPassword, userPassword as string);
  if (!valid) {
    return {
      message: 'Incorrect password', 
      payload: { ...data } 
    }
  }

  //log in user
  await createSession(id, name);

  return {
    code: 0,
    message: 'Login successful',
    redirect: `/${name.replace(' ', '')}`,
  }
}


// sign up action
export const signupSA = async (initialState: StateAuthForm, formData: FormData): Promise<StateAuthForm> => {
  const data = Object.fromEntries(formData);
  const validatedData = signupSchema.safeParse(data);

  console.log('signup');

  if (!validatedData.success) {
    const error = z.treeifyError(validatedData.error);
    return {
      error,
      payload: {
        ...data
      }
    }
  }

  const email = validatedData.data.email.trim();
  const name = validatedData.data.username.trim();
  const formPassword = validatedData.data.password.trim();
  
  //check if user already exist
  try {
    console.log('check if exist')
    const user = await prisma.users.findFirst({
      where: {
        OR: [
          {email},
          {name}
        ]
      }
    })

    console.log('user?', user)

    if (user) {
      if (user.name === name && user.email === email) {
        return {
          message: 'Account already exist sign in instead',
          payload: {
            ...data
          }
        }
      } else if (user.name === name) {
        return {
          error: {
            errors: [],
            properties: {
              username: {
                errors: ['Username is not available']
              }
            }
          },
          payload: {
            ...data
          }
        }
      } else if (user.email === email) {
        return {
          error: {
            errors: [],
            properties: {
              email: {
                errors: ['Email already in use']
              }
            }
          },
          payload: {
            ...data
          }
        }
      }
    }
  } catch (e) {
    return {
      message: 'Server error, cannot reach database, try again later',
      code: 1,
      payload: {
        ...data
      }
    }
  }

  // hash password
  const password = await bcrypt.hash(formPassword, 10);
  const otp = generateOTP(6);

  const info = JSON.stringify({
    name,
    password,
    otp,
  })

  try {
    // send otp to email
    const html = otpHTMLTemplate
      .replace('{{OTP}}', otp.toString())
      .replaceAll('{{YourApp}}', 'ChessDotCom')
      .replace('{{Expire}}', '5');

    await transporter.sendMail({
      from: '"ChessDotCom" <rence.ferry.dev@gmail.com>',
      to: email,
      subject: 'Verify your email with OTP',
      html: html
    })

    // store otp
    await prisma.shortInfo.upsert({
      where: {
        email: email
      },
      update: {
        info,
        ex: new Date(Date.now() + 1000 * 60 * 5)
      },
      create: {
        email,
        info,
        ex: new Date(Date.now() + 1000 * 60 * 5)
      }
    })

  } catch (e) {
    console.error(e);
    return {
      message: 'server error, try again later',
      code: 1,
      payload: { ...data }
    }
  }

  (await cookies()).set({
    name: "email",
    value: email,
    path: '/',
    maxAge: 60 * 5,
    httpOnly: true,
  })
  
  redirect(`/verifyEmail?ex=${Date.now() + 1000 * 60 * 5}`);
}


//verify email action
export async function verifyEmailSA(initialState: StateAuthForm, formData: FormData) {
  const cookie = await cookies();
  const email = cookie.get('email')?.value;
  const otp = formData.get('otp')?.toString();

  // check if otp is valid
  if (!otp || otp.length !== 6) return {
    message: 'Invalid OTP',
    code: 1,
  }

  // check if email is in cookie
  if (!email) return {
    message: "No email provided, please try <h1 className='text-blue-200'>signing up</h1>",
    code: 1
  }
  
  // get otp from db
  let res;
  try {
    res = await prisma.shortInfo.findUnique({
      where: {
        email
      }
    });

  } catch(e) {
    console.error(e);
    return {
      message: 'Server Error, try again later',
      code: 1
    }
  }

  if (!res)
  {
    return {
      message: 'OTP does not exist, please sign up again or request new OTP',
      code: 1
    }
  }

  if (res.ex < new Date()) {
    return {
      message: 'OTP expired, please sign up again or request a new OTP',
      code: 1
    }
  }

  const {name, password, otp: resOtp } = res.info ? JSON.parse(res.info) : {name: '', password: '', otp: 0};
  console.log(otp);

  if (resOtp !== parseInt(otp)) {
    return {
      message: 'Incorrect OTP',
      code: 1
    }
  }

  try {
    await prisma.shortInfo.delete({
      where: {
        email
      }
    })
  } catch (e) {
    console.error(e);
    return {
      message: 'Server error, try again later',
      code: 1
    }
  }

  // generate avatar and create user
  const sex = (await gender.getByFullName(name)).gender || 'unknown';
  const image = `https://api.dicebear.com/9.x/avataaars/svg?seed=${resOtp}&sex=${sex}`;
  console.log(sex, image);

  let user;
  try {
    user = await prisma.users.create({
      data: {
        email,
        name,
        password,
        image
      }
    })
  } catch (e) {
    return {
      code: 1,
      message: 'Server error, try again later',
    }
  }


  await createSession(user.id, user.name);

  return {
    code: 0,
    message: 'Account created',
    redirect: `/${user.name.replaceAll(' ', '')}`,
  };
}