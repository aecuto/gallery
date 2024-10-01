/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import { generate } from "random-words";
import InfiniteScroll from "react-infinite-scroll-component";
interface Photo {
  id: string;
  download_url: string;
  hashtags: string[];
}

const words = generate(Number(process.env.NEXT_PUBLIC_HASHTAGS) || 5);

export default function Home() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [hashtag, setHashTag] = useState<string>("");
  const [page, setPage] = useState(1);

  const fetchData = () => {
    axios
      .get(`https://picsum.photos/v2/list?page=${page}&limit=15`)
      .then((res: any) => {
        const data = res.data.map((data: any[]) => {
          const random = Math.floor(Math.random() * words.length);
          const size = Math.floor(Math.random() * 5000) + 100;
          const size2 = Math.floor(Math.random() * 5000) + 100;
          return {
            ...data,
            hashtags: words.slice(random),
            download_url: `https://placehold.co/${size}x${size2}`,
          };
        });
        setPhotos((prev) => [...prev, ...data]);
      });
    setPage((prev) => prev + 1);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const data = useMemo(() => {
    return photos.filter((photo) => {
      return !hashtag ? true : photo.hashtags.includes(hashtag);
    });
  }, [hashtag, photos]);

  return (
    <div className="p-10">
      <InfiniteScroll
        dataLength={photos.length}
        next={fetchData}
        hasMore={true}
        loader={<h4>Loading...</h4>}
        endMessage={
          <p style={{ textAlign: "center" }}>
            <b>Yay! You have seen it all</b>
          </p>
        }
      >
        {hashtag && (
          <div
            className="bg-blue-500 hover:bg-blue-800 p-1 rounded w-fit text-center mb-3 cursor-pointer"
            onClick={() => setHashTag("")}
          >
            Clear (#{hashtag})
          </div>
        )}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
          {data?.map((photo) => (
            <div key={photo.id}>
              <img
                className="object-cover object-center w-full h-40 max-w-full rounded-lg"
                alt="gallery-photo"
                src={photo.download_url}
              />
              <div className="flex flex-wrap">
                {photo.hashtags.map((tag) => (
                  <div
                    key={tag}
                    className="mr-1 hover:text-blue-500 cursor-pointer"
                    onClick={() => setHashTag(tag)}
                  >
                    #{tag}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </InfiniteScroll>
    </div>
  );
}
