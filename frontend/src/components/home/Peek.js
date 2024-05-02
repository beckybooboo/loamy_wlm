import decisionsupport from "../static/outcomes2.png";
import actionplan from "../static/behaviormods.png";
import wlmchat from "../static/wlmchat2.png";


const posts = [
  {
    id: 1,
    title: "Decision Support",
    href: "#",
    description:
      "Get outcome expectations for number of eggs retrieved, fertilized eggs, and day 5 embryos based on women like you.",
    imageUrl: decisionsupport,
  },
  {
    id: 2,
    title: "Personalized Action Plan",
    href: "#",
    description:
      "Receive a customized plan & behavior modifications to achieve your reproductive goals.",
    imageUrl: actionplan,
  },
  {
    id: 3,
    title: "Chat With the Literature",
    href: "#",
    description:
      "Ask questions. Explore our curated scientific, peer-reviewed literature on fertility that informed your action plan. ",
    imageUrl: wlmchat,
  },
];

export default function Peek() {
  return (
    <div className="pt-24 sm:pt-32" id="womenlikeme">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl">
            How It Works
          </h2>
        </div>
        <div className="mx-auto mt-8 grid max-w-xs grid-cols-1 gap-x-8 gap-y-4 lg:mx-0 md:max-w-none md:grid-cols-3">
          {posts.map((post) => (
            <article
              key={post.id}
              className="flex flex-col items-start"
            >
              <div className="relative w-full flex items-center">
                <div className="p-6 aspect-[16/9] w-full rounded-2xl bg-primary/5 sm:aspect-[2/1] lg:aspect-[3/2]">
                  <img
                    src={post.imageUrl}
                    alt=""
                    className="w-full h-full object-cover rounded-md"
                  />
                </div>
                <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-gray-900/10" />
              </div>
              <div className="max-w-xl">
                <div className="group relative">
                  <h3 className="mt-3 text-lg font-semibold leading-6 text-neutral-900 group-hover:text-neutral-600">
                    <p>
                      <span className="absolute inset-0" />
                      {post.title}
                    </p>
                  </h3>
                  <p className="mt-3 line-clamp-3 text-sm leading-6 text-neutral-600">
                    {post.description}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
