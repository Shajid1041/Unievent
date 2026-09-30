export async function uploadToImgBB(imageFile) {
    const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;
    if (!apiKey) {
        throw new Error("ImgBB API key is missing in .env.local");
    }

    const formData = new FormData();
    formData.append("image", imageFile);

    const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
        method: "POST",
        body: formData,
    });

    const data = await response.json();
    if (data.success) {
        return data.data.url; // Returns direct Image URL
    } else {
        throw new Error(data.error?.message || "Image upload failed");
    }
}