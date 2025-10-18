import React, { useState } from "react";
import bill from "../../../utils/API/bill/bill";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

export default function FeedBack({ sanpham_id, hoadon_id }) {
  const newFeedBack = useMutation({
    mutationFn: (data) => bill.feedBack(data),
    onSuccess: () => toast.success("Cảm ơn vì đánh giá của bạn"),
    onError: () => toast.error("Có lỗi, vui lòng thử lại sau"),
  });

  const [formdata, setFormdata] = useState({
    mota: "",
    image_url: null,
    rating: 0,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    newFeedBack.mutate({ ...formdata, sanpham_id, hoadon_id });
  };

  return (
    <div>
      {newFeedBack.isLoading ? (
        <div className="custom-loader"></div>
      ) : (
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={formdata.mota}
            onChange={(e) => setFormdata({ ...formdata, mota: e.target.value })}
            placeholder="Bình luận đánh giá"
          />
          <input
            type="file"
            onChange={(e) =>
              setFormdata({ ...formdata, image_url: e.target.files[0] })
            }
          />
          <input
            type="number"
            value={formdata.rating}
            onChange={(e) =>
              setFormdata({ ...formdata, rating: Number(e.target.value) })
            }
          />
          <button type="submit">Gửi đánh giá</button>
        </form>
      )}
    </div>
  );
}
