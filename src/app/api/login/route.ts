import { NextRequest } from 'next/server';

import axios from 'axios';
import User from '@/interfaces/user';
import GenerateHash from '@/lib/generateHash';

export async function POST(request: NextRequest, response: Response) {
  const body = await request.json();

  const code = body.code as string;

  const resp = await axios
    .post(`https://quavergame.com/oauth2/token`, {
      client_id: process.env.NEXT_PUBLIC_QUAVER_CLIENT_ID,
      client_secret: process.env.NEXT_PUBLIC_QUAVER_CLIENT_SECRET,
      grant_type: 'client_credentials',
      code,
    })
    .catch((e) => console.log('Error 1'));

  const access_token = resp?.data.access_token;

  if (!access_token) {
    return Response.json({ status: 400, msg: 'Access code not found.' });
  }
  const resp2 = await axios
    .post(
      'https://quavergame.com/oauth2/me',
      { code: access_token },
      {
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_QUAVER_CLIENT_SECRET}`,
        },
      }
    )
    .then((resp) => resp)
    .catch((e) => console.log('Error 2'));

  if (!resp2?.data) return Response.json({ status: 500, message: "Server Error"})

  const user = resp2?.data.user

  const existingUser: any = await axios.get(`${process.env.NEXT_PUBLIC_REDIRECT_URI?.replace("/login", "")}/api/user?quaver_id=${user.id}`).catch((e) => console.log('Error 3')); 


  if (existingUser?.status === 200) {
    return Response.json({status: 200, data: existingUser.data});
  }

  const userData: User = {
    id: existingUser.highestID + 1,
    quaver_id: user.id,
    username: user.username,
    avatar: user.avatar,
    hash: GenerateHash(user.id),
  };

  let errored = false;
  let errorText = ""

  await axios.post(`${process.env.NEXT_PUBLIC_REDIRECT_URI?.replace("/login", "")}/api/user`, userData).catch(e => {errored = true; errorText = e})

  if (errored) return Response.json({status: 500, error: errorText})

  return Response.json({ status: 200, data: userData });
}
