export const CATEGORIES = ["Photo Studio", "Film Stage", "Podcast Lounge", "Music Suite", "Workshop"];

export const AMENITY_OPTIONS = [
  "Wi-Fi", "Air conditioning", "Lighting kit", "Backdrops", "Green screen", "Sound treatment",
  "Mixer", "Microphones", "Makeup station", "Green room", "Parking", "Kitchenette", "Power backup",
];

export const STATUS_STYLES = {
  Pending: "badge-warning",
  Confirmed: "badge-success",
  Completed: "badge-info",
  Cancelled: "badge-error",
};

export const money = (n) => `$${Number(n || 0).toLocaleString("en-US", { maximumFractionDigits: 2 })}`;
