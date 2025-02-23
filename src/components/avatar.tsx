import { AvatarFallback, AvatarImage, Avatar as ShadAvatar } from "./ui/avatar";

export function Avatar({
  roomId,
  userId,
  username,
}: {
  roomId?: string;
  userId?: string;
  username?: string;
}) {
  return (
    <ShadAvatar>
      <AvatarImage
        src={`${window.ENV.API_URL}/${userId ? "user-" : ""}image/${
          userId ?? roomId
        }`}
      />
      <AvatarFallback>{username ?? "?"}</AvatarFallback>
    </ShadAvatar>
  );
}
