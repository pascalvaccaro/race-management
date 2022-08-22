/* eslint-disable react/jsx-key */
import React, { useEffect, useState } from 'react';
import { Table, Thead, Tbody, Tr, Td, Th } from '@strapi/design-system/Table';
import { Box } from '@strapi/design-system/Box';
import { Typography } from '@strapi/design-system/Typography';
import { Divider } from '@strapi/design-system/Divider';
import { Flex } from '@strapi/design-system/Flex';
import { Badge } from '@strapi/design-system/Badge';
import parse from 'html-react-parser';
import { useParams, useLocation } from 'react-router-dom';
import { Breadcrumbs, Crumb } from '@strapi/design-system/Breadcrumbs';
import { Stack } from '@strapi/design-system/Stack';
import { Link } from '@strapi/design-system/Link';
import ArrowLeft from '@strapi/icons/ArrowLeft';
import { IconButton } from '@strapi/design-system/IconButton';
import CarretUp from '@strapi/icons/CarretUp';
import ExclamationMarkCircle from '@strapi/icons/ExclamationMarkCircle';
import { EmptyStateLayout } from '@strapi/design-system/EmptyStateLayout';
import CarretDown from '@strapi/icons/CarretDown';
import { NextLink, PageLink, Pagination, PreviousLink } from '@strapi/design-system/Pagination';
import { currencies } from '../ProductList/constant';
import { getProductPayments } from '../../utils/apiCalls';

const limit = 7;

const PaymentDetailsTable = () => {
  const { productId, productName } = useParams();
  const search = useLocation().search;
  const page = new URLSearchParams(search).get('page');
  const pageNumber = page ? parseInt(page, 10) : 1;
  const offset = pageNumber === 1 ? 0 : (pageNumber - 1) * limit;

  const [payments, setPayments] = useState();
  const [productDetail, setProductDetail] = useState();
  const [sortAscendingName, setSortAscendingName] = useState(true);
  const [sortAscendingEmail, setSortAscendingEmail] = useState(true);
  const [sortAscendingTxnDate, setSortAscendingTxnDate] = useState(true);
  const [sortOrderName, setSortOrderName] = useState(true);
  const [sortOrderEmail, setSortOrderEmail] = useState(false);
  const [sortOrderTxnDate, setSortOrderTxnDate] = useState(false);
  const [totalCount, setTotalCount] = useState();

  const pageCount = Math.ceil(totalCount / limit);

  useEffect(async () => {
    let sort;
    let order;

    if (sortOrderName) {
      sort = 'name';
      order = sortAscendingName ? 'asc' : 'desc';
    } else if (sortOrderEmail) {
      sort = 'email';
      order = sortAscendingEmail ? 'asc' : 'desc';
    } else if (sortOrderTxnDate) {
      sort = 'date';
      order = sortAscendingTxnDate ? 'asc' : 'desc';
    }
    const response = await getProductPayments(productId, sort, order, offset, limit);

    if (response?.data) {
      setPayments(response.data.payments);
      if (response.data.payments.length)
        setProductDetail(response.data.payments[0].stripeProduct);
      setTotalCount(response.data.count);
    }
  }, [sortAscendingName, sortAscendingEmail, sortAscendingTxnDate, offset]);

  const getTransactionAmount = (txnAmount, currency) => {
    const currencyObj = currencies.find(
      item => item.abbreviation.toLowerCase() === currency?.toLowerCase()
    );
    const symbol = currencyObj?.symbol;

    const txnAmountWithCurrency = (
      <Flex>
        <span>{symbol ? parse(symbol) : ''}</span>
        <Box>{new Intl.NumberFormat().format(txnAmount)}</Box>
      </Flex>
    );

    return txnAmountWithCurrency;
  };

  const getTransactionDateTime = date => {
    const dates = new Date(date);

    // get the date as a string
    const paymentDate = dates.toDateString();

    // get the time as a string
    const paymentTime = dates.toLocaleTimeString();
    const dateTime = (
      <Badge>
        {paymentDate}&nbsp;&nbsp;&nbsp;{paymentTime}
      </Badge>
    );

    return dateTime;
  };

  const handleSortNameCarretUp = async () => {
    setSortAscendingName(false);
    setSortOrderName(true);
    setSortOrderEmail(false);
    setSortOrderTxnDate(false);
  };

  const handleSortNameCarretDown = async () => {
    setSortAscendingName(true);
    setSortOrderName(true);
    setSortOrderEmail(false);
    setSortOrderTxnDate(false);
  };

  const handleSortEmailCarretUp = async () => {
    setSortAscendingEmail(false);
    setSortOrderName(false);
    setSortOrderEmail(true);
    setSortOrderTxnDate(false);
  };

  const handleSortEmailCarretDown = async () => {
    setSortAscendingEmail(true);
    setSortOrderName(false);
    setSortOrderEmail(true);
    setSortOrderTxnDate(false);
  };

  const handleSortTxnDateCarretUp = async () => {
    setSortAscendingTxnDate(false);
    setSortOrderName(false);
    setSortOrderEmail(false);
    setSortOrderTxnDate(true);
  };

  const handleSortTxnDateCarretDown = async () => {
    setSortAscendingTxnDate(true);
    setSortOrderName(false);
    setSortOrderEmail(false);
    setSortOrderTxnDate(true);
  };

  const getPaymentMode = (isSubscription, interval) => {
    let mode;

    if (!isSubscription && !interval) {
      mode = 'One-Time';
    } else if (isSubscription && interval) {
      if (interval === 'month') {
        mode = 'Mensuel';
      } else if (interval === 'year') {
        mode = 'Annuel';
      } else if (interval === 'week') {
        mode = 'Hebdomadaire';
      }
    }

    return mode;
  };

  const ROW_COUNT = 6;
  const COL_COUNT = 10;

  return (
    <>
      <Box paddingLeft={7} paddingTop={6}>
        <Link to="/plugins/strapi-stripe" startIcon={<ArrowLeft />}>
          Retour
        </Link>
      </Box>
      <Box paddingTop={4} paddingLeft={7}>
        <Stack horizontal spacing={3}>
          <Breadcrumbs label="Category model, name field">
            <Crumb>{productName}</Crumb>
            <Crumb>Détails de la transaction</Crumb>
          </Breadcrumbs>
        </Stack>
      </Box>
      <Box padding={3}>
        <Divider />
      </Box>
      <Box
        paddingTop={6}
        paddingBottom={6}
        paddingLeft={7}
        paddingRight={7}
        background="neutral100"
      >
        {payments && payments.length > 0 ? (
          <Table colCount={COL_COUNT} rowCount={ROW_COUNT}>
            <Thead>
              <Tr>
                <Th>
                  <Typography variant="sigma">Nom du donateur</Typography>
                  {sortAscendingName ? (
                    <IconButton
                      onClick={handleSortNameCarretUp}
                      label="trier par nom"
                      noBorder
                      icon={<CarretUp />}
                    />
                  ) : (
                    <IconButton
                      onClick={handleSortNameCarretDown}
                      label="trier par nom"
                      noBorder
                      icon={<CarretDown />}
                    />
                  )}
                </Th>
                <Th>
                  <Typography variant="sigma">Email</Typography>
                  {sortAscendingEmail ? (
                    <IconButton
                      onClick={handleSortEmailCarretUp}
                      label="trier par email"
                      noBorder
                      icon={<CarretUp />}
                    />
                  ) : (
                    <IconButton
                      onClick={handleSortEmailCarretDown}
                      label="trier par email"
                      noBorder
                      icon={<CarretDown />}
                    />
                  )}
                </Th>
                <Th>
                  <Typography variant="sigma">Type de paiement</Typography>
                </Th>
                <Th>
                  <Typography variant="sigma">Montant</Typography>
                </Th>
                <Th>
                  <Typography variant="sigma">Date</Typography>
                  {sortAscendingTxnDate ? (
                    <IconButton
                      onClick={handleSortTxnDateCarretUp}
                      label="trier par date"
                      noBorder
                      icon={<CarretUp />}
                    />
                  ) : (
                    <IconButton
                      onClick={handleSortTxnDateCarretDown}
                      label="trier par date"
                      noBorder
                      icon={<CarretDown />}
                    />
                  )}
                </Th>
              </Tr>
            </Thead>
            <Tbody>
              {payments &&
                payments.map(payment => (
                  <Tr key={payment.id}>
                    <Td>
                      <Typography textColor="neutral800">{payment.customerName}</Typography>
                    </Td>
                    <Td>
                      <Typography textColor="neutral800">{payment.customerEmail}</Typography>
                    </Td>
                    <Td>
                      <Typography textColor="neutral800">
                        {getPaymentMode(
                          payment.stripeProduct.isSubscription,
                          payment.stripeProduct.interval
                        )}
                      </Typography>
                    </Td>
                    <Td>
                      <Typography textColor="neutral800">
                        {getTransactionAmount(payment.txnAmount, productDetail?.currency)}
                      </Typography>
                    </Td>
                    <Td>
                      <Typography textColor="neutral800">
                        {getTransactionDateTime(payment.txnDate)}
                      </Typography>
                    </Td>
                  </Tr>
                ))}
            </Tbody>
          </Table>
        ) : (
          <Box background="neutral100">
            <EmptyStateLayout
              icon={<ExclamationMarkCircle />}
              content="Ce produit n'a aucune donation"
            />
          </Box>
        )}
      </Box>
      <Flex justifyContent="end" paddingRight={8}>
        {pageCount ? (
          <Pagination activePage={pageNumber} pageCount={pageCount}>
            <PreviousLink
              to={`/plugins/strapi-stripe/report/${productId}/${productName}?page=${
                pageNumber - 1
              }`}
            >
              Page précédente
            </PreviousLink>
            {[...Array(pageCount)].map((count, idx) => (
              <PageLink
                number={idx + 1}
                to={`/plugins/strapi-stripe/report/${productId}/${productName}?page=${idx + 1}`}
              >
                {idx + 1}
              </PageLink>
            ))}

            <NextLink
              to={`/plugins/strapi-stripe/report/${productId}/${productName}?page=${
                pageNumber + 1
              }`}
            >
              Page suivante
            </NextLink>
          </Pagination>
        ) : (
          ''
        )}
      </Flex>
    </>
  );
};

export default PaymentDetailsTable;
