import { Button, HStack, Image } from '@chakra-ui/react';
import type { Session } from 'next-auth';
import { signIn, signOut } from 'next-auth/react';
import brandLogo from '../../public/solo_logo.png';
import brandWrite from '../../public/solo_scritta.png';
import Nav from '../Layout/NavBar';

const testMode = process.env.TEST_MODE === 'true';

type NavBarProps = {
  user: Session['user'] | undefined;
};

export default function Navbar({ user }: NavBarProps) {
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
          <button
            type="button"
            className="text-white"
            disabled={testMode}
            onClick={() => signIn('google')}
          >
            Sign in
          </button>
        </div>
      ) : (
        <HStack>
          <div>{user.name}</div>
          <Button
            colorScheme="red"
            size={['sm', 'md']}
            isDisabled={testMode}
            onClick={() => signOut()}
          >
            Log out
          </Button>
        </HStack>
      )}
    </Nav>
  );
}
