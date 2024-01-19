# big-random-playlist-for-soundcloud
* 사운드클라우드 랜덤재생모듈
* demo -> https://big-random-playlist-for-soundcloud.vercel.app/viram
* 처음 플레이할 때 딜레이가 조금 있습니다. 3~4초? 5초? 참을성을 갖고 기다려야돼 ,, 
<img width="844" alt="image" src="https://github.com/v1r4m/big-random-playlist-for-soundcloud/assets/26866063/25a507d8-62e9-4b4b-9af6-14b5e1fa9b7a">


### main feature
* 일단 Next.js(타입스크립트)로 만들어 봤는데요 어떤 거냐면
* 사운드클라우드는 지금 서비스를 몇년을 했는데 플레이리스트에 곡이 30개가 넘어가면 셔플이 30개내에서밖에 안되는 고질적인 문제가 있구요 
* 그래서 도합 1000곡정도 되는 제 메인 플레이리스트를 셔플해서 들을 수 있는 마이크로서비스입니다
* BE(next server)에서 음악 파일을 통째로 가져오는게 아니라 스트리밍을 해보고 싶었고 성공했습니다(readableStream)
* 내가 들으려고 랜덤 플레이리스트를 만들었는데 잘 발전시켜서 다른 사람들도 이용할 수 있도록 배포하면 좋겠습니다
* 사운드클라우드는 api 샤따 내린지 좀 됐구요 그래서 `soundcloud.ts`라는 라이브러리를 사용했는데 너무 느려서 아무래도 내부 코드를 까봐야겠습니다 web scraping 같은 불길한 예감이 듭니다
* SSR이 아닌 CSR입니다 그럴거면 next.js 왜 쓴거지? 그냥 라우팅 편한 리액트입니다...

### 우선순위
* 곡 끝나면 자동 refetching
* now playing... 
* 생긴거 개못생김
* 이대로라면 플레이리스트가 늘어날수록 fetching 시간이 너무 늘어나므로 좋은 방법을 생각해내야함
* 모두가 쓸 수 있도록 바꾸기
* 모두가 쓸 수 있게 바꿨으면 내 쿠키(key)가 아니라 각자의 쿠키를 사용할 수 있도록 하기

### 고쳐야 할 점!!!!
* play()는 웹페이지와 상호작용이 되지 않은 시점에서 동작하지 않음. 오류 처리 핸들링할 것
* 다음 곡으로 넘어갈 때 곡 두 개 가져오는 현상
