












import { useState, useEffect } from "react";
import axios from "axios";

export default function useSalesData({ search, filters, sort, page }) {
  const [data, setData] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const stableFilters = JSON.stringify(filters);
  const stableSort = JSON.stringify(sort);

  useEffect(() => {
    setLoading(true);
    setError("");

    const params = {};
    if (search) params.search = search;
    if (page) params.page = page;

    if (sort && sort.sortBy) params.sortBy = sort.sortBy;
    if (sort && sort.sortOrder) params.sortOrder = sort.sortOrder;

    const joinArr = (value) => {
      if (!value) return undefined;
      if (Array.isArray(value)) return value.length ? value.join(',') : undefined;
      if (typeof value === 'string' && value.trim() !== '') return value;
      return undefined;
    };

    const regionParam = joinArr(filters?.region);
    if (regionParam) params.region = regionParam;
    const genderParam = joinArr(filters?.gender);
    if (genderParam) params.gender = genderParam;
    const categoryParam = joinArr(filters?.productCategory);
    if (categoryParam) params.productCategory = categoryParam;
    const tagsParam = joinArr(filters?.tags);
    if (tagsParam) params.tags = tagsParam;
    const paymentParam = joinArr(filters?.paymentMethod);
    if (paymentParam) params.paymentMethod = paymentParam;

    if (filters?.age) {
      const normalizedAge = String(filters.age).trim();
      if (normalizedAge.includes('-')) {
        const [min, max] = normalizedAge
          .split('-')
          .map((segment) => parseInt(segment, 10))
          .filter(Boolean);
        if (!Number.isNaN(min)) params.ageMin = min;
        if (!Number.isNaN(max)) params.ageMax = max;
      } else if (normalizedAge.endsWith('+')) {
        const min = parseInt(normalizedAge.replace('+', ''), 10);
        if (!Number.isNaN(min)) params.ageMin = min;
      }
    }

    if (filters?.dateFrom) params.dateFrom = filters.dateFrom;
    if (filters?.dateTo) params.dateTo = filters.dateTo;

    axios
      .get('http://localhost:5000/api/sales', { params })
      .then((res) => {
        setData(res.data.data);
        setPagination(res.data.pagination);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [search, stableFilters, stableSort, page]);

  return { data, pagination, loading, error };
}



