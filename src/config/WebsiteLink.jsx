export default function WebsiteLink(link) {
  const lin = window.location.pathname.split("/")[1];
  if (lin === "superadmin") return "/superadmin" + link;
  else return link;
}
