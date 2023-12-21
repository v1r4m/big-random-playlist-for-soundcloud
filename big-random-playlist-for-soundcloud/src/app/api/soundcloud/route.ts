import Soundcloud from "soundcloud.ts";

import { NextApiRequest, NextApiResponse } from "next";

export async function GET(
    req: NextApiRequest,
  ) {
    const soundcloud = new Soundcloud({
      clientId: process.env.CLIENT_ID,
      oauthToken : process.env.OAUTH_TOKEN,
    });

    const playlist = await soundcloud.tracks.getV2("succducc/azure");
    return Response.json(playlist);

    //return Response.json({ message: 'Hello from Next.js!' })
  }