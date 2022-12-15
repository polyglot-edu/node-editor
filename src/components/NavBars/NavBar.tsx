import { Button, HStack, Image } from '@chakra-ui/react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import brandLogo from '../../public/solo_logo.png';
import brandWrite from '../../public/solo_scritta.png';
import { User } from '../../types/user';
import Nav from '../Layout/NavBar';

type NavBarProps = {
  user: User | undefined;
  redirectLogin?: string;
  redirectLogout?: string;
};

export default function Navbar({
  user,
  redirectLogout,
  redirectLogin,
}: NavBarProps) {
  const router = useRouter();
  const BACK_URL = process.env.BACK_URL;
  const LOGOUT_URL =
    BACK_URL +
    '/api/auth/logout?returnUrl=' +
    (redirectLogout || router.asPath);
  const LOGIN_URL =
    BACK_URL + '/api/auth/google?returnUrl=' + (redirectLogin || router.asPath);

  return (
    <Nav>
      <HStack>
        <Image
          src={brandLogo.src}
          width={['40px']}
          className="mr-3"
          alt="Polyglot Logo"
        />
        <Image
          src={brandWrite.src}
          width={['0px', '110px']}
          className="mr-3 self-center"
          alt="Polyglot Logo"
        />
      </HStack>
      {!user ? (
        <div className="rounded-lg bg-cyan-400 pr-2 pl-2 pt-1 pb-1">
          <Link
            href={LOGIN_URL}
            className="text-white"
            style={{ textDecoration: 'none' }}
          >
            Sign in
          </Link>
        </div>
      ) : (
        <HStack>
          <div>{user.username}</div>
          <Link href={LOGOUT_URL} style={{ textDecoration: 'none' }}>
            <Button colorScheme="red" size={['sm', 'md']}>
              Log out
            </Button>
          </Link>
        </HStack>
      )}
    </Nav>
  );
}
