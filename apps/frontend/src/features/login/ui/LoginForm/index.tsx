import KakaoLogo from "../../../../../public/kakao.svg";
import NaverLogo from "../../../../../public/naver.svg";

export function LoginForm() {
  return (
    <div className="flex flex-col items-center gap-6">
      <div className="text-center text-lg font-semibold">간편 로그인</div>
      <div className="flex flex-col items-center gap-2">
        <a
          className="flex h-12 w-64 items-center justify-center gap-2 rounded-lg bg-[#FEE500] bg-cover bg-no-repeat text-[rgba(0,0,0,0.85)]"
          href="/api/auth/kakao"
        >
          <img className="w-4" src={KakaoLogo}></img>
          카카오 로그인
        </a>
        <a
          className="flex h-12 w-64 items-center justify-center gap-2 rounded-lg bg-[#03C75A] bg-cover bg-no-repeat text-[#ffffff]"
          href="/api/auth/naver"
        >
          <img className="w-4" src={NaverLogo}></img>
          네이버 로그인
        </a>
      </div>
    </div>
  );
}
