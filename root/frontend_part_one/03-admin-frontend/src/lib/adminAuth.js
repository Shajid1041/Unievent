export function setAdminSession(token, adminData) {
    if (typeof window !== "undefined") {
        localStorage.setItem("adminToken", token);
        localStorage.setItem("adminData", JSON.stringify(adminData));
    }
}

export function getAdminToken() {
    if (typeof window !== "undefined") {
        return localStorage.getItem("adminToken");
    }
    return null;
}

export function getAdminData() {
    if (typeof window !== "undefined") {
        const data = localStorage.getItem("adminData");
        return data ? JSON.parse(data) : null;
    }
    return null;
}

export function removeAdminSession() {
    if (typeof window !== "undefined") {
        localStorage.removeItem("adminToken");
        localStorage.removeItem("adminData");
    }
}