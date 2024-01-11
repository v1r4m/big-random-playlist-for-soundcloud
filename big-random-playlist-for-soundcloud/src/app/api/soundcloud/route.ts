import Soundcloud from "soundcloud.ts";
//ref: https://nextjs.org/docs/app/building-your-application/routing/route-handlers#streaming

export async function GET(
) {
  const soundcloud = new Soundcloud({
    clientId: process.env.CLIENT_ID,
    oauthToken: process.env.OAUTH_TOKEN,
  });

  const playlist1 = await soundcloud.playlists.getV2('https://soundcloud.com/v1r4m/sets/beat');
  const playlist2 = await soundcloud.playlists.getV2('https://soundcloud.com/v1r4m/sets/2-1a');
  //와진심 개무식함...개별로...진짜개별로... 다른방법을생각해보셈......

  var totalTracks = playlist1.track_count + playlist2.track_count;
  var randomTrack = Math.floor(Math.random() * totalTracks);
  var randomTrackUri = "";
  if (randomTrack>playlist1.track_count){
      randomTrack = randomTrack - playlist1.track_count;
      randomTrackUri = playlist2.tracks[randomTrack].permalink_url;
  }else{
      randomTrackUri = playlist1.tracks[randomTrack].permalink_url;
  }

  const playlist = await soundcloud.util.streamTrack(randomTrackUri);
  var rs = new Response(playlist);
  rs.headers.set('url', randomTrackUri);
  return rs;
}