/**
 *
 * This component is the responsible for displaying all the created Products.
 *
 */

import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Box } from '@strapi/design-system/Box';
import { Typography } from '@strapi/design-system/Typography';
import { Divider } from '@strapi/design-system/Divider';
import CreateProduct from '../CreateProduct';
import ProductTable from './productTable';
import { getStripeProduct, createStripeProduct, updateStripeProduct, deleteStripeProduct } from '../../utils/apiCalls';
import EditProduct from './editProduct';

const limit = 5;
const ProductList = () => {
  const search = useLocation().search;
  const page = new URLSearchParams(search).get('page');
  const pageNumber = page ? parseInt(page, 10) : 1;

  const [isVisible, setIsVisible] = useState(false);
  const [productData, setProductData] = useState();
  const [isEditVisible, setEditVisible] = useState(false);
  const [productId, setProductId] = useState();
  const [count, setCount] = useState();
  const [sortAscendingName, setSortAscendingName] = useState(true);
  const [sortAscendingPrice, setSortAscendingPrice] = useState(true);
  const [sortOrderName, setSortOrderName] = useState(true);
  const [sortOrderPrice, setSortOrderPrice] = useState(false);

  const offset = pageNumber === 1 ? 0 : (pageNumber - 1) * limit;

  useEffect(() => {
    (async () => {
      let sort;
      let order;

      if (sortOrderName) {
        sort = 'name';
        order = sortAscendingName ? 'asc' : 'desc';
      } else if (sortOrderPrice) {
        sort = 'price';
        order = sortAscendingPrice ? 'asc' : 'desc';
      }

      const response = await getStripeProduct(offset, limit, sort, order);

      setProductData(response.data.data);
      setCount(response.data.count);
    })();
  }, [isVisible, isEditVisible, offset, sortAscendingName, sortAscendingPrice]);

  const handleCloseModal = () => {
    setIsVisible(false);
  };

  const handleSaveProduct = async (
    title,
    price,
    imageId,
    imageUrl,
    description,
    isSubscription,
    paymentInterval,
    trialPeriodDays,
    isFreeAmount,
  ) => {
    const createProduct = await createStripeProduct(
      title,
      price,
      imageId,
      imageUrl,
      description,
      isSubscription,
      paymentInterval,
      trialPeriodDays,
      isFreeAmount,
    );

    if (createProduct?.data?.id) {
      setIsVisible(false);
    }
  };

  const handleSortAscendingName = () => {
    setSortAscendingName(true);
    sortOrderName(true);
    sortOrderPrice(false);
  };

  const handleSortDescendingName = () => {
    setSortAscendingName(false);
    sortOrderName(true);
    sortOrderPrice(false);
  };

  const handleSortAscendingPrice = () => {
    setSortAscendingPrice(true);
    setSortOrderName(false);
    setSortOrderPrice(true);
  };

  const handleSortDescendingPrice = () => {
    setSortAscendingPrice(false);
    setSortOrderName(false);
    setSortOrderPrice(true);
  };

  const handleEnableEditMode = async id => {
    setProductId(id);
    setEditVisible(true);
  };

  const handleCloseEditModal = () => {
    setEditVisible(false);
  };

  const handleUpdateProduct = async (
    productId,
    title,
    url,
    description,
    productImageId,
    stripeProductId,
    isFreeAmount,
  ) => {
    const updateProduct = await updateStripeProduct(
      productId,
      title,
      url,
      description,
      productImageId,
      stripeProductId,
      isFreeAmount,
    );

    if (updateProduct?.data?.id) {
      setEditVisible(false);
    }
  };
  const handleClickDeleteProduct = async (productId) => {
    await deleteStripeProduct(productId);
    setProductData(prev => prev.filter(p => p.id !== productId));
  }

  const handleClickCreateProduct = () => setIsVisible(prev => !prev);

  return (
    <Box>
      <Box paddingTop={6} paddingLeft={7}>
        <Typography variant="alpha">Donations via Stripe</Typography>
        <Box>
          <Typography variant="omega">
            Les donations peuvent être effectuées avec une carte de crédit, Apple Pay et Google Pay sur le site A Ton Allure.
          </Typography>
        </Box>
      </Box>
      <Box padding={3}>
        <Divider />
      </Box>
      <CreateProduct
        isVisible={isVisible}
        handleClose={handleCloseModal}
        handleClickSave={handleSaveProduct}
      />
      <EditProduct
        productId={productId}
        isEditVisible={isEditVisible}
        handleCloseEdit={handleCloseEditModal}
        handleClickUpdateEdit={handleUpdateProduct}
      />

      <Box>
        <ProductTable
          products={productData}
          handleSortAscendingName={handleSortAscendingName}
          handleSortDescendingName={handleSortDescendingName}
          handleEditClick={id => handleEnableEditMode(id)}
          totalCount={Math.ceil(count / limit)}
          page={pageNumber}
          sortAscendingName={sortAscendingName}
          handleSortAscendingPrice={handleSortAscendingPrice}
          handleSortDescendingPrice={handleSortDescendingPrice}
          sortAscendingPrice={sortAscendingPrice}
          handleClickCreateProduct={handleClickCreateProduct}
          handleClickDeleteProduct={handleClickDeleteProduct}
        />
      </Box>
    </Box>
  );
};

export default ProductList;
