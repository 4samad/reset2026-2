export default function YouTubeVideoSection() {
  const videoId = "XS6JyKA84GI";

  return (
    <div className="card bg-neutral text-neutral-content shadow-xl border-4 border-neutral-focus rounded-3xl overflow-hidden">
      <div className="card-body p-2 pt-6 sm:pt-8">
        <h2 className="card-title text-xl sm:text-2xl mb-2 px-2">
          Watch Our Podcast 🍿
        </h2>

        <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
          <iframe
            className="absolute top-0 left-0 w-full h-full rounded-2xl"
            src={`https://www.youtube.com/embed/${videoId}`}
            title="YouTube video player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          ></iframe>
        </div>
      </div>
    </div>
  );
}
