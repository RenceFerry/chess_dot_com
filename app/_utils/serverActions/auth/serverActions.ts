'use server'

import z from 'zod';
import { loginSchema, signupSchema } from "@/_lib/zodSchema";
import type { RedisOtpPayload, StateAuthForm } from '../../../_lib/types';
import bcrypt from 'bcrypt';
import prisma from '@/_lib/prisma';
import { createSession } from '../../sessions';
import transporter from '@/_lib/brevo';
import getRedis from '@/_lib/redis';
import { generateOTP } from '@/_utils/helpers';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import fs from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

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
        }
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

  console.log('check')

  //validate password
  const { id, password: UserPassword, name } = user;
  const valid = await bcrypt.compare(formPassword, UserPassword as string);
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
    redirect: `/${name}/play`,
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
      message: 'Server error, try again later',
      code: 1,
      payload: {
        ...data
      }
    }
  }

  // hash password
  const password = await bcrypt.hash(formPassword, 10);

  console.log('b redis')

  const otp = generateOTP(6);
  try {
    // send otp to email
    const html = otpHTMLTemplate
      .replace('{{OTP}}', otp.toString())
      .replace('{{YourApp}}', 'ChessDotCom')
      .replace('{{Expire}}', '5');

    await transporter.sendMail({
      from: 'ChessDotCom <no-reply@ChessDotCom.com',
      to: email,
      subject: 'Verify your email with OTP',
      html: html
    })

    // store otp in redis
    await (await getRedis()).json.set(email, '$', {
      otp,
      password,
      name
    });
  } catch (e) {
    console.error(e);
    return {
      message: 'server error, try again later',
      code: 1
    }
  }


  console.log('a redis');

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

  if (!otp || otp.length !== 6) return {
    message: 'Invalid OTP',
    code: 1,
  }

  if (!email) return {
    message: "No email provided, please try <h1 className='text-blue-200'>signing up</h1>",
    code: 1
  }

  let res: RedisOtpPayload;
  try {
    res = await (await getRedis()).json.get(email, { path: '$' }) as RedisOtpPayload;
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
      message: 'OTP expired, please sign up again',
      code: 1
    }
  }

  const {name, password, otp: resOtp} = res;

  if (resOtp !== parseInt(otp)) {
    return {
      message: 'Incorrect OTP',
      code: 1
    }
  }

  //create user
  let user;
  try {
    user = await prisma.users.create({
      data: {
        email,
        name,
        password
      }
    })
  } catch (e) {
    return {
      code: 1,
      message: 'Server error, try again later',
    }
  }

  await (await getRedis()).json.del(email);

  await createSession(user.id, user.name);

  return {
    code: 0,
    message: 'Account created',
    redirect: `/${user.name}/play`,
  };
}