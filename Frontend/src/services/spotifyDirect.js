import { getMoodConfig } from "../utils/moodConfig.js";

const API = "https://api.spotify.com/v1";

const MOOD_SEARCHES = {
  happy: [
    "Pharrell Williams Happy official",
    "Bruno Mars Uptown Funk",
    "Dua Lipa Levitating",
    "Katy Perry Roar",
    "Lizzo Good as Hell",
    "Meghan Trainor All About That Bass",
    "Justin Timberlake Can't Stop the Feeling",
    "Carly Rae Jepsen Call Me Maybe",
    "Zedd Beautiful Now",
    "Avicii Wake Me Up",
  ],
  sad: [
    "Billie Eilish when the party's over",
    "Olivia Rodrigo drivers license",
    "Lewis Capaldi Someone You Loved",
    "XXXTentacion SAD!",
    "Juice WRLD Lucid Dreams",
    "Sam Smith Stay With Me",
    "James Arthur Say You Won't Let Go",
    "Adele Someone Like You",
    "Ed Sheeran The A Team",
    "Shawn Mendes In My Blood",
  ],
  angry: [
    "Eminem Lose Yourself",
    "Linkin Park Numb",
    "NF Let You Down",
    "Twenty One Pilots Stressed Out",
    "Imagine Dragons Demons",
    "Billie Eilish Bad Guy",
    "Post Malone rockstar",
    "Travis Scott goosebumps",
    "Lil Nas X MONTERO",
    "Machine Gun Kelly bad things",
  ],
  fearful: [
    "Lana Del Rey Summertime Sadness",
    "Bon Iver Skinny Love",
    "James Blake Retrograde",
    "Birdy Skinny Love cover",
    "Novo Amor Anchor",
    "Phoebe Bridgers Motion Sickness",
    "Daughter Youth",
    "The National Bloodbuzz Ohio",
    "Gregory Alan Isakov Stable Song",
    "Iron and Wine Flightless Bird",
  ],
  disgusted: [
    "Frank Ocean Thinking Bout You",
    "Daniel Caesar Best Part",
    "SZA Good Days",
    "H.E.R. Best Part",
    "Khalid Location",
    "Daniel Caesar Get You",
    "Jhene Aiko None of Your Concern",
    "Lucky Daye Roll Some Mo",
    "Summer Walker Over It",
    "Giveon Heartbreak Anniversary",
  ],
  surprised: [
    "The Weeknd Blinding Lights",
    "Harry Styles As It Was",
    "Dua Lipa Don't Start Now",
    "Coldplay Yellow",
    "Drake One Dance",
    "Ariana Grande 7 rings",
    "Doja Cat Say So",
    "Taylor Swift Shake It Off",
    "Ed Sheeran Shape of You",
    "Bruno Mars Treasure",
  ],
  neutral: [
    "Childish Gambino Redbone",
    "Mac Miller Small Worlds",
    "J. Cole Love Yourz",
    "Kendrick Lamar Money Trees",
    "Drake Hold On We're Going Home",
    "Tyler the Creator See You Again",
    "Frank Ocean Pink Matter",
    "Anderson Paak Come Down",
    "Chance the Rapper Blessings",
    "Noname Diddy Bop",
  ],
};

async function searchTrack(query, accessToken) {
  const url =
    API +
    "/search?q=" +
    encodeURIComponent(query) +
    "&type=track&limit=5&market=US";
  const res = await fetch(url, {
    headers: { Authorization: "Bearer " + accessToken },
  });

  if (!res.ok) {
    console.warn("Search failed:", query, res.status);
    return [];
  }

  const data = await res.json();
  const items = data.tracks?.items || [];

  // Prefer tracks with preview URLs
  const withPreview = items.filter((t) => t.preview_url);
  return withPreview.length > 0 ? withPreview : items;
}

export async function getTracksByMood(mood, accessToken, limit = 20) {
  const config = getMoodConfig(mood);
  const queries = MOOD_SEARCHES[mood] || MOOD_SEARCHES.neutral;

  console.log("[Vibezfy] Searching tracks for mood:", mood);

  const results = await Promise.all(
    queries.map((q) => searchTrack(q, accessToken)),
  );

  const seen = new Set();
  const withPreview = [];
  const withoutPreview = [];

  for (const batch of results) {
    for (const t of batch) {
      if (seen.has(t.id) || !t.name) continue;
      seen.add(t.id);
      const track = {
        id: t.id,
        uri: t.uri,
        name: t.name,
        artists: t.artists.map((a) => a.name),
        album: t.album?.name || "",
        albumArt: t.album?.images?.[0]?.url || null,
        duration: t.duration_ms || 0,
        previewUrl: t.preview_url || null,
        spotifyUrl: t.external_urls?.spotify || null,
      };
      if (t.preview_url) {
        withPreview.push(track);
      } else {
        withoutPreview.push(track);
      }
    }
  }

  // Put preview tracks first, then the rest
  const allTracks = [...withPreview, ...withoutPreview];

  // Shuffle only the preview group for variety
  for (let i = withPreview.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [allTracks[i], allTracks[j]] = [allTracks[j], allTracks[i]];
  }

  const finalTracks = allTracks.slice(0, limit);
  console.log(
    "[Vibezfy]",
    finalTracks.filter((t) => t.previewUrl).length,
    "tracks with preview,",
    finalTracks.length,
    "total",
  );

  return {
    mood,
    moodLabel: config.label,
    emoji: config.emoji,
    playlistName: config.playlistName,
    ambientScene: config.ambientScene,
    gradient: config.gradient,
    tracks: finalTracks,
  };
}
