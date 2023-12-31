import Soundcloud from "soundcloud.ts";
//ref: https://nextjs.org/docs/app/building-your-application/routing/route-handlers#streaming

export async function GET(
) {
  const soundcloud = new Soundcloud({
    clientId: process.env.CLIENT_ID,
    oauthToken: process.env.OAUTH_TOKEN,
  });

  const playlist = await soundcloud.util.streamTrack("https://soundcloud.com/virtual-riot/emotionalrmx");
  return new Response(playlist);
}