import { GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { getUserBySessionToken, User } from '../database/users';

type Props = {
  user?: User;
  refreshUserProfile: () => Promise<void>;
};

// problem with ts undefined
/* type Props = {
  user?: User;
}; */

export default function UserProfile(props: Props) {
  const router = useRouter();
  if (!props.user) {
    return (
      <>
        <Head>
          <title>User not found</title>
          <meta name="description" content="User not found" />
        </Head>
        <h1>404 - User not found</h1>
      </>
    );
  }

  async function deleteUserFromApiById(id: number) {
    await fetch(`/api/profiles/${id}`, {
      method: 'DELETE',
      body: JSON.stringify({
        id: id,
      }),
    });
    await props.refreshUserProfile();
    // redirect user to home after deleting profile
    await router.push(`/`);
  }

  return (
    <>
      <Head>
        <title>Personal Information</title>
        <meta name="description" content="Biography of the person" />
      </Head>
      <h1>Personal Information</h1>
      username: {props.user.username}
      <button onClick={() => deleteUserFromApiById(props.user!.id)}>
        delete
      </button>
    </>
  );
}

// delete User by Session Token?

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const token = context.req.cookies.sessionToken;

  const user = token && (await getUserBySessionToken(token));

  if (!user) {
    return {
      redirect: {
        destination: '/login?returnTo=/',
        permanent: false,
      },
    };
  }

  return {
    props: { user },
  };
}
