import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import ProductCard from './components/ProductCard';
import { Product, ApiResponse } from './types';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Scrollbar } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
import { BsChevronLeft, BsChevronRight } from 'react-icons/bs';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import './App.css';

const App: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const swiperRef = useRef<SwiperType | null>(null);

  const API_BASE_URL = process.env.NODE_ENV === 'production' 
    ? ''
    : 'http://localhost:5000';

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const url = `${API_BASE_URL}/api/products`;
      
      const response = await axios.get<ApiResponse>(url);
      
      if (response.data.success) {
        setProducts(response.data.data);
      } else {
        setError(response.data.message || 'Failed to fetch products');
      }
    } catch (err) {
      console.error('Error fetching products:', err);
      if (axios.isAxiosError(err) && err.response?.status === 404) {
        setError('API server not found. Please make sure the backend server is running on port 5000.');
      } else if (axios.isAxiosError(err) && err.code === 'ECONNREFUSED') {
        setError('Cannot connect to the backend server. Please make sure it is running.');
      } else {
        setError('Failed to fetch products. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="app-container">
        <div className="loading">Loading products...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="app-container">
        <div className="error">
          <div>
            <h2>Error</h2>
            <p>{error}</p>
            <button 
              onClick={() => fetchProducts()}
              style={{
                marginTop: '10px',
                padding: '10px 20px',
                backgroundColor: '#333',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer'
              }}
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      <h1 className="title-main">Product List</h1>
      {products.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '40px',
          fontSize: '16px',
          color: '#666',
          fontFamily: 'Avenir, Helvetica, Arial, sans-serif'
        }}>
          No products found.
        </div>
      ) : (
        <div className="products-carousel-container">
          <button 
            className="custom-swiper-button-prev"
            onClick={() => swiperRef.current?.slidePrev()}
          >
            {BsChevronLeft({})}
          </button>
          
          <button 
            className="custom-swiper-button-next"
            onClick={() => swiperRef.current?.slideNext()}
          >
            {BsChevronRight({})}
          </button>
          
          <Swiper
            modules={[Pagination, Scrollbar]}
            spaceBetween={25}
            slidesPerView={4}
            onSwiper={(swiper: SwiperType) => {
              swiperRef.current = swiper;
            }}
            pagination={{
              clickable: true,
              dynamicBullets: true,
            }}
            scrollbar={{
              draggable: true,
            }}
            breakpoints={{
              320: {
                slidesPerView: 1,
                spaceBetween: 15,
              },
              768: {
                slidesPerView: 2,
                spaceBetween: 20,
              },
              1024: {
                slidesPerView: 3,
                spaceBetween: 25,
              },
              1200: {
                slidesPerView: 4,
                spaceBetween: 25,
              },
            }}
            className="products-swiper"
          >
            {products.map((product, index) => (
              <SwiperSlide key={`${product.name}-${index}`}>
                <ProductCard product={product} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      )}
    </div>
  );
};

export default App;