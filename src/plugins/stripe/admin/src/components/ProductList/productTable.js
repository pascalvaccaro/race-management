/* eslint-disable react/no-array-index-key */

/**
 *
 * This component is the responsible for displaying the table.
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { FormattedNumber, FormattedDate } from 'react-intl';
import { Table, Thead, Tbody, Tr, Td, Th, TFooter } from '@strapi/design-system/Table';
import { Flex } from '@strapi/design-system/Flex';
import { Box } from '@strapi/design-system/Box';
import { IconButton } from '@strapi/design-system/IconButton';
import { Link, useRouteMatch } from 'react-router-dom';
import { Typography } from '@strapi/design-system/Typography';
import { NextLink, PageLink, Pagination, PreviousLink } from '@strapi/design-system/Pagination';
import { EmptyStateLayout } from '@strapi/design-system/EmptyStateLayout';
import { VisuallyHidden } from '@strapi/design-system/VisuallyHidden';
import { Button } from '@strapi/design-system/Button';
import Pencil from '@strapi/icons/Pencil';
import CarretUp from '@strapi/icons/CarretUp';
import CarretDown from '@strapi/icons/CarretDown';
import Plus from '@strapi/icons/Plus';
import ChartPie from '@strapi/icons/ChartPie';
import Cross from '@strapi/icons/Cross';
import SettingLink from './SettingLink';

const ProductTable = ({
  products,
  handleSortAscendingName,
  handleSortDescendingName,
  handleEditClick,
  totalCount,
  page,
  sortAscendingName,
  handleSortAscendingPrice,
  handleSortDescendingPrice,
  sortAscendingPrice,
  handleClickCreateProduct,
  handleClickDeleteProduct,
}) => {
  const { url } = useRouteMatch();
  const ROW_COUNT = 6;
  const COL_COUNT = 10;

  const handleSortCarretUp = React.useCallback(() => {
    handleSortDescendingName();
  }, [handleSortDescendingName]);

  const handleSortCarretDown = React.useCallback(() => {
    handleSortAscendingName();
  }, [handleSortAscendingName]);

  const handleSortCarretUpPrice = React.useCallback(() => {
    handleSortDescendingPrice();
  }, [handleSortDescendingPrice]);

  const handleSortCarretDownPrice = React.useCallback(() => {
    handleSortAscendingPrice();
  }, [handleSortAscendingPrice]);

  const getPaymentMode = React.useCallback((isSubscription, interval) => {
    let mode;

    if (!isSubscription && !interval) {
      mode = 'One-Time';
    } else if (isSubscription && interval) {
      if (interval === 'month') {
        mode = 'Monthly';
      } else if (interval === 'year') {
        mode = 'Year';
      } else if (interval === 'week') {
        mode = 'Weekly';
      }
    }

    return mode;
  }, []);

  const getTrialPeriodDays = React.useCallback((trialPeriodDays, isSubscription) => {
    let trialDays;

    if (isSubscription && trialPeriodDays) {
      trialDays = trialPeriodDays;
    } else if (isSubscription && !trialPeriodDays) {
      trialDays = 0;
    } else if (!isSubscription && !trialPeriodDays) {
      trialDays = 'NA';
    }

    return trialDays;
  }, []);

  return (
    <>
      <Box
        paddingTop={6}
        paddingBottom={6}
        paddingLeft={7}
        paddingRight={7}
        background="neutral100"
      >
        {products && products.length > 0 ? (
          <Table
            colCount={COL_COUNT}
            rowCount={ROW_COUNT}
            footer={
              <TFooter icon={<Plus />} onClick={handleClickCreateProduct}>
                Créer un nouveau produit / abonnement
              </TFooter>
            }
          >
            <Thead>
              <Tr>
                <Th>
                  <Typography variant="sigma">Nom</Typography>&nbsp;
                  {sortAscendingName ? (
                    <IconButton
                      onClick={handleSortCarretUp}
                      label="sort by Name"
                      noBorder
                      icon={<CarretUp />}
                    />
                  ) : (
                    <IconButton
                      onClick={handleSortCarretDown}
                      label="sort by Name"
                      noBorder
                      icon={<CarretDown />}
                    />
                  )}
                </Th>
                <Th>
                  <Typography variant="sigma">Prix</Typography>
                  {sortAscendingPrice ? (
                    <IconButton
                      onClick={handleSortCarretUpPrice}
                      label="sort by price"
                      noBorder
                      icon={<CarretUp />}
                    />
                  ) : (
                    <IconButton
                      onClick={handleSortCarretDownPrice}
                      label="sort by Name"
                      noBorder
                      icon={<CarretDown />}
                    />
                  )}
                </Th>
                <Th>
                  <Typography variant="sigma">Mode de paiement</Typography>
                </Th>
                <Th>
                  <Typography variant="sigma">Période d'essai</Typography>
                </Th>
                <Th>
                  <Typography variant="sigma">Product ID / Price ID</Typography>
                </Th>
                <Th>
                  <VisuallyHidden>Actions</VisuallyHidden>
                </Th>
              </Tr>
            </Thead>
            <Tbody>
              {products &&
                products.map(product => (
                  <Tr key={product.id}>
                    <Td>
                      <Typography
                        variant="epsilon"
                        textColor="neutral800"
                        textTransform="capitalize"
                      >
                        {product.title}
                      </Typography>
                      <Box>
                        <Typography variant="pi">
                          <FormattedDate value={product.createdAt} />
                        </Typography>
                      </Box>
                    </Td>
                    <Td>
                      <Typography textColor="neutral800">
                        <FormattedNumber value={product.price} currency={product.currency} style="currency" maximumFractionDigits="0" />
                        <span>{" "}({product.isFreeAmount ? 'libre' : 'fixe'})</span>
                      </Typography>
                    </Td>
                    <Td>
                      <Typography textColor="neutral800">
                        {getPaymentMode(product.isSubscription, product.interval)}
                      </Typography>
                    </Td>
                    <Td>
                      <Typography textColor="neutral800">
                        {getTrialPeriodDays(product.trialPeriodDays, product.isSubscription)}
                      </Typography>
                    </Td>
                    <Td>
                      <Typography textColor="neutral800">
                        {product.stripeProductId} <br /> {product.stripePriceId}
                      </Typography>
                    </Td>
                    <Td>
                      <Flex justifyContent="end">
                        <Link
                          to={`${url}/report/${product.id}/${product.title}`}
                          style={{ textDecoration: 'none' }}
                        >
                          <IconButton label="Lister les donations" icon={<ChartPie />} />
                        </Link>
                        <Box paddingLeft={2}>
                          <IconButton
                            onClick={() => handleEditClick(product.id)}
                            label="Éditer"
                            icon={<Pencil />}
                          />
                        </Box>
                        <Box paddingLeft={2}>
                          <IconButton
                            onClick={() => handleClickDeleteProduct(product.id)}
                            label="Supprimer"
                            icon={<Cross />}
                          />
                        </Box>
                      </Flex>
                    </Td>
                  </Tr>
                ))}
            </Tbody>
          </Table>
        ) : (
          <Box>
            <EmptyStateLayout
              icon=""
              content=""
              action={
                <Button variant="secondary" startIcon={<Plus />} onClick={handleClickCreateProduct}>
                  Create your first Product / Subscription
                </Button>
              }
            />
          </Box>
        )}
      </Box>

      <Flex justifyContent="end" paddingRight={8}>
        {totalCount ? (
          <Pagination activePage={page} pageCount={totalCount}>
            <PreviousLink to={`/plugins/strapi-stripe?page=${page - 1}`}>
              Go to previous page
            </PreviousLink>
            {totalCount &&
              [...Array(totalCount)].map((count, idx) => (
                <PageLink key={idx} number={idx + 1} to={`/plugins/strapi-stripe?page=${idx + 1}`}>
                  Go to page 1
                </PageLink>
              ))}

            <NextLink to={`/plugins/strapi-stripe?page=${page + 1}`}>Go to next page</NextLink>
          </Pagination>
        ) : (
          ''
        )}
      </Flex>
      <br />
      <Box paddingTop={6} paddingBottom={6} paddingLeft={7} paddingRight={7}>
        <SettingLink />
      </Box>
    </>
  );
};

ProductTable.propTypes = {
  products: PropTypes.any.isRequired,
  handleSortAscendingName: PropTypes.any.isRequired,
  handleSortDescendingName: PropTypes.any.isRequired,
  handleEditClick: PropTypes.any.isRequired,
  totalCount: PropTypes.any.isRequired,
  page: PropTypes.any.isRequired,
  sortAscendingName: PropTypes.any.isRequired,
  handleSortAscendingPrice: PropTypes.any.isRequired,
  handleSortDescendingPrice: PropTypes.any.isRequired,
  sortAscendingPrice: PropTypes.any.isRequired,
  handleClickCreateProduct: PropTypes.any.isRequired,
};

export default ProductTable;
