import React, { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import shearchAPI from "../../../utils/API/bill/shearch.js";
import useDebounce from "../../shared/useDebounce.jsx";

export default function Shearch({ keyword }) {
  const [results, setResults] = useState([]);
  // hàm delay
  const debouncedKeyword = useDebounce(keyword, 1000);

  const shearch = useMutation({
    mutationFn: (data) => shearchAPI.Shearch(data),
    onSuccess: (res) => {
      setResults(res.data.data); // cập nhật kết quả tìm kiếm
    },
  });

  useEffect(() => {
    console.log("useEffect debouncedKeyword:", debouncedKeyword);

    if (debouncedKeyword.trim() !== "") {
      console.log("Calling API with:", debouncedKeyword);
      shearch.mutate({ keyword: debouncedKeyword });
    } else {
      console.log("Keyword empty, clear results");
      setResults([]);
    }
  }, [debouncedKeyword]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {results.map((item) => (
        <div key={item.sanpham_id} className="border p-2 rounded shadow">
          <img
            src={item.url_sanpham}
            alt={item.ten_sanpham}
            className="w-full h-48 object-cover rounded"
          />
          <h3 className="text-lg font-semibold mt-2">{item.ten_sanpham}</h3>
          <p className="text-gray-600">{item.ten_shop}</p>
          <p className="text-red-500 font-bold">
            {item.gia_ban.toLocaleString()}₫
          </p>
        </div>
      ))}
      {results.length === 0 && (
        <p className="col-span-full text-center text-gray-500 mt-4">
          Không tìm thấy sản phẩm nào.
        </p>
      )}
    </div>
  );
}
