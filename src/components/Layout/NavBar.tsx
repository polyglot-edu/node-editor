import { Button, Flex, HStack, Image } from '@chakra-ui/react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import brandLogo from '../../public/solo_logo.png';
import brandWrite from '../../public/solo_scritta.png';
import { User } from '../../types/user';

type NavBarProps = {
  user: Nullable<User>;
  redirectLogin?: string;
  redirectLogout?: string;
};

export default function Navbar({ user }: NavBarProps) {
  const router = useRouter();
  const BACK_URL = process.env.BACK_URL;
  const CURRENT_URL = process.env.CURRENT_HOST + router.asPath;

  return (
    <Flex
      as="nav"
      align="center"
      justify="space-between"
      wrap="wrap"
      p={4}
      bg={'black'}
      color={'white'}
    >
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
            href={BACK_URL + '/api/auth/google?returnUrl=' + CURRENT_URL}
            className="text-white"
            style={{ textDecoration: 'none' }}
          >
            Sign in
          </Link>
        </div>
      ) : (
        <HStack>
          <div>{user.username}</div>
          <Link
            href={BACK_URL + '/api/auth/logout'}
            style={{ textDecoration: 'none' }}
          >
            <Button colorScheme="red" size={['sm', 'md']}>
              Log out
            </Button>
          </Link>
        </HStack>
      )}
    </Flex>
  );
}
