function getProjectsVideos(root: ParentNode) {
  return Array.from(root.querySelectorAll("video"));
}

export function playProjectsVideos(root: ParentNode) {
  for (const video of getProjectsVideos(root)) {
    video.muted = true;
    void video.play().catch(() => {});
  }
}

export function pauseProjectsVideos(root: ParentNode) {
  for (const video of getProjectsVideos(root)) {
    video.pause();
  }
}
