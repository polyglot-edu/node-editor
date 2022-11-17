import { NextRouter, useRouter } from 'next/router';
import Navbar from '../../components/NavBars/NavBar';
import { useUser } from '../../context/user.context';
import { API } from '../../data/api';

const handleFormSubmit = (router: NextRouter) => async (event: any) => {
  event.preventDefault();
  console.log(event.target.title.value);
  try {
    const resp = await API.createNewFlow({
      title: event.target.title.value,
      description: event.target.description.value,
      nodes: [],
      edges: [],
    });
    console.log(resp.data);
    const payload = resp.data;
    if (!payload.id) console.log('error');
    router.replace('/flows/' + payload.id);
  } catch (error) {
    console.log(error);
  }
};

const FlowIndexPage = () => {
  const { user, loading } = useUser();
  const router = useRouter();

  if (!user && loading) return null;

  return (
    <>
      <Navbar user={user} />
      <div className="flex flex-col w-screen h-screen justify-center items-center">
        <form
          className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
          onSubmit={handleFormSubmit(router)}
        >
          <div className="mb-4 mr-8">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="username"
            >
              Titolo
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="title"
              type="text"
              placeholder="Title"
              required
            />
          </div>
          <div className="mb-4 mr-8">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="username"
            >
              Descrizione
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="description"
              type="text"
              placeholder="Description"
              required
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline border-0"
              type="button"
            >
              Reset
            </button>
            <button
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline border-0"
              type="submit"
            >
              Send
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default FlowIndexPage;
