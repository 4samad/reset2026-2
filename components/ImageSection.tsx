import Image from 'next/image';

export default function ImageSection() {
  return (
    <div className="card bg-base-100 shadow-xl border-4 border-base-300 rounded-2xl overflow-hidden">
      <div className="flex justify-center w-full">
        <Image
          src="/terry-crews-quote.png"
          alt="Terry Crews Quote"
          width={1200}
          height={630}
          className="w-full md:w-auto h-auto"
          unoptimized
        />
      </div>
    </div>
  );
}
