import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { User } from "../../types/user"
import brandLogo from '../../public/solo_logo.png';
import brandWrite from '../../public/solo_scritta.png';

type NavBarProps = {
    user: Nullable<User>;
    redirectLogin?: string;
    redirectLogout?: string;
}

export default function Navbar({user}: NavBarProps){
  const router = useRouter();
  const BACK_URL = process.env.BACK_URL;
  const CURRENT_URL = process.env.CURRENT_HOST + router.asPath;

 return (
    <nav className="bg-black py-3 shadow">
      <div className="flex items-center justify-between mx-2">
        <div className="flex ">
          <Image src={brandLogo} width={40} className="mr-3" alt="Polyglot Logo" />
          <Image src={brandWrite} width={110} className="mr-3 self-center" alt="Polyglot Logo" />
        </div>
        {!user ? (
          <div className="rounded-lg bg-cyan-400 pr-2 pl-2 pt-1 pb-1">
            <Link href={BACK_URL + '/api/auth/google?returnUrl='+ CURRENT_URL} className="text-white" style={{ textDecoration: 'none' }}>Sign in</Link>
          </div>
        ) : (
          <div className="flex items-center space-x-2">
            <div className="hidden rounded-full  h-8 w-8 border-2 border-solid border-white"/>
            <div className="text-white">{user.username}</div>
            <div className="rounded-lg bg-red-500 pr-2 pl-2 pt-1 pb-1">
              <Link href={BACK_URL + '/api/auth/logout'} className="text-white" style={{ textDecoration: 'none' }}>Log out</Link>
            </div>
          </div>
        )}
        
      </div>
    </nav>
 )
}