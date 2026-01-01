'use client';

import { useState } from 'react';
import { readingResources } from '@/data/content';
import Image from 'next/image';

export default function ReadingResourcesSection() {
  const [showAll, setShowAll] = useState(false);
  const displayedResources = showAll ? readingResources : readingResources.slice(0, 4);

  return (
    <div className="card bg-base-100 shadow-xl border-4 border-base-300 rounded-2xl">
      <div className="card-body p-6 sm:p-8">
        <h2 className="card-title text-base sm:text-lg mb-4">
          Reading Resources
        </h2>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {displayedResources.map(resource => (
            <a
              key={resource.id}
              href={resource.url}
              target="_blank"
              rel="noopener noreferrer"
              className="card card-compact bg-base-200 hover:shadow-lg transition-all transform hover:scale-102 group rounded-xl"
            >
              <figure className="relative h-24 bg-base-300 rounded-t-xl overflow-hidden">
                <Image
                  src={resource.image}
                  alt={resource.title}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </figure>
              <div className="card-body p-3">
                <h3 className="text-xs font-bold group-hover:text-primary transition-colors mb-2 line-clamp-2">
                  {resource.title}
                </h3>
                <button className="btn bg-white btn-xs w-fit">
                  Read
                </button>
              </div>
            </a>
          ))}
        </div>

        {!showAll && readingResources.length > 4 && (
          <div className="flex justify-center mt-4">
            <button
              onClick={() => setShowAll(true)}
              className="btn btn-ghost btn-sm"
            >
              Show More
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
