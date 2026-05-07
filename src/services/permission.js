export default function permission(data, menu, permission_type) {
  if (data) {
    if (!data.roles.length || data.roles.includes("Super Admin")) {
      return true;
    }
    let access = data.permission[menu];
    if (access && access.includes(permission_type)) {
      return true;
    }
    return false;
  } else {
    return false;
  }
}
