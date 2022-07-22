import { useUserContext } from '../lib/UserContext';

const Home = () => {
  const { userState } = useUserContext();
  console.log("Home: userState", userState)
  return (
    <div>
      {userState?.currentUser ?
        `You are logged in as ${userState?.currentUser?.email}`
      :
        `no currentUser`
      }
    </div>
  )
};
export default Home;