// import { useState, useEffect } from "react";
// import API from "../services/api";

// export default function useSalesData(params) {
//   const [loading, setLoading] = useState(true);
//   const [data, setData] = useState([]);
//   const [pagination, setPagination] = useState({});
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     let active = true;

//     async function fetchData() {
//       try {
//         setLoading(true);

//         const res = await API.get("/sales", {
//           params
//         });

//         if (!active) return;

//         setData(res.data.data);
//         setPagination(res.data.pagination);
//       } catch (err) {
//         if (active) setError(err);
//       } finally {
//         if (active) setLoading(false);
//       }
//     }

//     fetchData();

//     return () => {
//       active = false; // cancel stale updates
//     };
//   }, [params]);

//   return { data, pagination, loading, error };
// }












import { useState, useEffect } from "react";
import axios from "axios";

export default function useSalesData({ search, filters, sort, page }) {
  
  const [data, setData] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Convert objects to stable strings to avoid infinite rerenders
  const stableFilters = JSON.stringify(filters);
  const stableSort = JSON.stringify(sort);

  useEffect(() => {
    setLoading(true);
    setError("");

    axios
      .get("http://localhost:5000/api/sales", {
        params: {
          search,
          filters,
          sort,
          page,
        },
      })
      .then((res) => {
        setData(res.data.data);
        setPagination(res.data.pagination);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [search, stableFilters, stableSort, page]);

  return { data, pagination, loading, error };
}
