'use server';

import supabase from '@/_lib/supabase';
import { authenticate } from './authenticate';
import { changePasswordSchema, userUpdateSchema } from '@/_lib/zodSchema';
import { ChangePasswordDataType, ChangePasswordReturnType, SettingsType, UserUpdateReturnType, UserUpdateSchemaErrorType, UserUpdateType } from '@/_lib/types';
import z from 'zod';
import prisma from '@/_lib/prisma';
import { createSession } from '../sessions';
import bcrypt from 'bcrypt';

export const updateUserDet = async (formData: FormData): Promise<{
  data: UserUpdateReturnType;
  error: UserUpdateSchemaErrorType | null;
}> => {
  const data = Object.fromEntries(formData.entries()) as UserUpdateType;

  // authenticate
  const decryted = await authenticate();
  if (!decryted) return {
    data: {
      email: data.email || '',
      name: data.name || '',
      image: null
    },
    error: { errors: ['unauthorized'] }
  };

  //validate data
  const validated = userUpdateSchema.safeParse(data);
  if (!validated.success) {
    const error = z.treeifyError(validated.error);
    return { data: {
      email: data.email || '',
      name: data.name || '',
      image: null
    },
    error: {
      errors: [''],
      properties: {
        email: {
          errors: error.properties?.email?.errors || [''],
        },
        name: {
          errors: error.properties?.name?.errors || [''],
        }
      },
      }
    }
  }

  const infoData = validated.data;

  try {
    // check if user already exist
    const exist = await prisma.users.findUnique({
      where: {
        name: infoData.name.trim(),
        NOT: { id: decryted.userId }
      },
      select: {
        name: true
      }
    })

    if (exist) throw new Error('Username already exist try another one');
    
    // check if email already exist

    // upload file if exist and get url
    let url: string | null = null;
    if (infoData.file instanceof File) {
      const filePath = decryted.userId + '/' + infoData.file.name;
  
      const { error } = await supabase.storage
        .from('avatar')
        .upload(filePath, infoData.file, { upsert: true })

      console.log(error, filePath);
      if (error) throw new Error('cannot upload file');

      const resUrl = supabase.storage.from('avatar').getPublicUrl(filePath);
      url = resUrl.data.publicUrl;
    }

    // store user informations
    let resData = { id: decryted.userId, name: decryted.name };
    if (decryted.name !== infoData.name) {
      resData = await prisma.users.update({
        where: {
          id: decryted.userId
        }, 
        data: {
          name: infoData.name.trim(),
          ...(url ? { image: url }: {})
        },
        select: {
          name: true,
          id: true
        }
      })
    }

    await createSession(resData.id, resData.name);

    console.log({
      data: {
        name: resData.name,
        image: url,
        email: infoData.email
      },
    })
  
    return {
      data: {
        name: resData.name,
        image: url,
        email: infoData.email
      },
      error: null
    }

  } catch (e) {
    if (e instanceof Error) {
      return { data: {
        email: data.email || '',
        name: data.name || '',
        image: null
      }, error: {
        errors: [e.message]
      }};
    }
    return { data: {
      email: data.email || '',
      name: data.name || '',
      image: null
    }, error: {
      errors: ['server error']
    }};
  }
}

export const changePasswordAction = async (_: ChangePasswordReturnType | null,formData: FormData): Promise<ChangePasswordReturnType> => {
  const data = Object.fromEntries(formData.entries()) as ChangePasswordDataType;

  // authenticate
  const decryted = await authenticate();
  if (!decryted) return {
    data,
    error: { errors: ['unauthorized'] },
    success: false
  };

  // check if new password matches confirm password
  const match = data.newPass.trim() === data.confirmPass.trim();

  console.log(data);
  const { data: validData, error, success } = changePasswordSchema.safeParse(data); 
  if (!success) {
    console.log(data, z.treeifyError(error));
    return {
      data,
      error: {
        ...z.treeifyError(error),
        ...(!match && { errors: ['New password and confirmation do not match'] })
      },
      success: false
    }
  }

  if (!match) {
    return {
      data,
      error: { errors: ['New password and confirmation do not match'] },
      success: false
    }
  }

  const confirmPass = data.confirmPass.trim();
  const currentPass = data.currentPass ? data.currentPass.trim() : false;

  try {
    // check if password match for user that has current  password
    if (data?.currentPass) {
      const res = await prisma.users.findUnique({
        where: {
          id: decryted.userId
        },
        select: {
          password: true
        }
      })

      // check if user exist
      if (!res) {
        throw new Error('user does not exist');
      }

      // compare
      if (res.password && currentPass) {
        const isMatch = await bcrypt.compare(currentPass, res.password);

        if (!isMatch) {
          throw new Error('Current password is incorrect')
        }
      }
    }

    const encryptedPass = await bcrypt.hash(confirmPass, 10);

    await prisma.users.update({
      where: {
        id: decryted.userId
      },
      data: {
        password: encryptedPass
      }
    })

    return {
      data,
      error: null,
      success: true
    }

  } catch (e) {
    if (e instanceof Error) {
      return {
        data,
        error: { errors: [e.message] },
        success: false
      }
    }
    return {
      data,
      error: { errors: ['server error'] },
      success: false
    }
  }
}

export const upDateSettings = async (settings: SettingsType): Promise<SettingsType> => {
  // authenticate
  const decryted = await authenticate();
  if (!decryted) return null;

  try {
    const set = await prisma.settings.upsert({
      where: {
        userId: decryted.userId
      },
      update: {...settings},
      create: {...settings, userId: decryted.userId},
      select: {
        chatDisable: true,
        chatPrivate: true,
        streamGame: true
      }
    })

    return set;
  } catch (e) { return null };
}