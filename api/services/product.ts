import axios from "axios";

export const GetProducts = async () => {
  try {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_STRAPI_BASE_URL}/api/products?populate=*`
    );
    return res.data.data;
  } catch (e) {
    console.log("error:", e);
    return [];
  }
};
