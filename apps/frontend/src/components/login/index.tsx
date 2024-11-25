import { Dialog } from "../commons/dialog";
import KakaoLogo from "../../../public/kakao.svg";
import NaverLogo from "../../../public/naver.svg";

interface LoginProps {
  isOpen: boolean;
  onCloseModal: () => void;
}

export default function Login({ isOpen, onCloseModal }: LoginProps) {
  return (
    <Dialog isOpen={isOpen} onCloseModal={onCloseModal}>
      <div className="flex flex-col items-center gap-6">
        <div className="text-center">
          <Dialog.Title>간편 로그인</Dialog.Title>
        </div>
        <div className="flex flex-col items-center gap-2">
          <a
            className="flex h-12 w-64 items-center justify-center gap-2 rounded-lg bg-[#FEE500] bg-cover bg-no-repeat text-[rgba(0,0,0,0.85)]"
            href=""
          >
            <img className="w-4" src={KakaoLogo}></img>
            카카오 로그인
          </a>
          <a
            className="flex h-12 w-64 items-center justify-center gap-2 rounded-lg bg-[#03C75A] bg-cover bg-no-repeat text-[#ffffff]"
            href=""
          >
            <img className="w-4" src={NaverLogo}></img>
            네이버 로그인
          </a>
        </div>
      </div>
      <Dialog.CloseButton onCloseModal={onCloseModal} />
    </Dialog>
  );
}
