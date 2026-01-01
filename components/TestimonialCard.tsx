'use client';

import { testimonials } from '@/data/content';

export default function TestimonialCard() {
  return (
    <div className="card bg-base-100 shadow-xl border-4 border-base-300 rounded-3xl">
      <div className="card-body p-6 sm:p-8">
        <h2 className="card-title text-base sm:text-lg mb-4">
          From the Community
        </h2>

        <div className="carousel w-full">
          {testimonials.slice(0, 4).map((testimonial, index) => (
            <div
              key={testimonial.id}
              id={`slide${index + 1}`}
              className="carousel-item relative w-full"
            >
              <div className="w-full">
                <div className="bg-base-200 p-4 rounded-2xl">
                  <p className="text-sm italic mb-3 leading-relaxed">
                    "{testimonial.text}"
                  </p>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-bold text-xs">{testimonial.username}</p>
                      <p className="text-xs opacity-70">Day {testimonial.day}</p>
                    </div>
                    <div className="badge badge-sm badge-primary">Verified</div>
                  </div>
                </div>

                <div className="absolute flex justify-between transform -translate-y-1/2 left-2 right-2 top-1/2">
                  <a
                    href={`#slide${index === 0 ? testimonials.slice(0, 4).length : index}`}
                    className="btn btn-circle btn-xs"
                  >
                    ❮
                  </a>
                  <a
                    href={`#slide${index === testimonials.slice(0, 4).length - 1 ? 1 : index + 2}`}
                    className="btn btn-circle btn-xs"
                  >
                    ❯
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-center mt-4">
          <div className="join">
            {testimonials.slice(0, 4).map((_, index) => (
              <a
                key={index}
                href={`#slide${index + 1}`}
                className="join-item btn btn-sm"
              >
                {index + 1}
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
