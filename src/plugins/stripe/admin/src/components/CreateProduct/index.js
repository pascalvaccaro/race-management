/**
 *
 * This component is the responsible for opening modal when the Add Product
 * button clicks.
 *
 */

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  ModalLayout,
  ModalBody,
  ModalHeader,
  ModalFooter,
} from '@strapi/design-system/ModalLayout';
import { Box } from '@strapi/design-system/Box';
import { Flex } from '@strapi/design-system/Flex';
import { Stack } from '@strapi/design-system/Stack';
import { Button } from '@strapi/design-system/Button';
import { Typography } from '@strapi/design-system/Typography';
import { Grid, GridItem } from '@strapi/design-system/Grid';
import { TextInput } from '@strapi/design-system/TextInput';
import { ToggleCheckbox } from '@strapi/design-system/ToggleCheckbox';
import { Loader } from '@strapi/design-system/Loader';
import { Select, Option } from '@strapi/design-system/Select';
import { NumberInput } from '@strapi/design-system/NumberInput';
import { Textarea } from '@strapi/design-system/Textarea';
import { prefixFileUrlWithBackendUrl } from '@strapi/helper-plugin';
import { uploadFiles } from '../../utils/apiCalls';

const CreateProduct = ({ isVisible, handleClose, handleClickSave }) => {
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState();
  const [image, setImage] = useState([]);
  const [paymentType, setPaymentType] = useState('');
  const [isSubscription, setIsSubscription] = useState(false);
  const [isFreeAmount, setIsFreeAmount] = useState(false);
  const [description, setDescription] = useState('');
  const [paymentInterval, setPaymentInterval] = useState('');
  const [trialPeriodDays, setTrialPeriodDays] = useState();
  const [heading, setHeading] = useState('Produit');
  const [error, setError] = useState({
    title: '',
    price: '',
    description: '',
    paymentType: '',
    paymentInterval: '',
  });
  const [upload, setUpload] = useState(false);

  const handleChange = React.useCallback(event => {
    const { name, value } = event.target;

    if (name === 'title') {
      setTitle(value);
      setError(prev => ({ ...prev, title: '' }));
    } else if (name === 'image') {
      setImage(event.target.files);
      setError(prev => ({ ...prev, image: '' }));
    } else if (name === 'description') {
      setDescription(value);
      setError(prev => ({ ...prev, description: '' }));
    } else if (name === 'isFreeAmount') {
      setIsFreeAmount(value);
    }
  }, []);

  const handleChangePaymentType = React.useCallback(value => {
    setPaymentType(value);
    setError(prev => ({ ...prev, paymentType: '' }));

    if (value === 'subscription') {
      setIsSubscription(true);
      setHeading('Abonnement');
    } else {
      setIsSubscription(false);
      setHeading('Produit');
    }
  }, []);

  const handleChangePaymentInterval = React.useCallback(value => {
    setPaymentInterval(value);
    setError(prev => ({ ...prev, paymentInterval: '' }));
  }, []);

  const handleChangeNumber = React.useCallback(value => {
    setPrice(value);
    setError(prev => ({ ...prev, price: '' }));
  }, []);

  const handleChangeTrialPeriod = React.useCallback(value => {
    setTrialPeriodDays(value);
  }, []);

  const handleSaveProduct = React.useCallback(async () => {
    if (!title && !price && !description && !paymentType) {
      setError(prev => ({
        ...prev,
        title: 'Title is required',
        price: 'Price is required',
        description: 'Description is required',
        paymentType: 'Payment Type is required',
        paymentInterval: '',
      }));
    } else if (!paymentType) {
      setError(prev => ({
        ...prev,
        title: '',
        price: '',
        description: '',
        paymentType: 'Payment Type is required',
        paymentInterval: '',
      }));
    } else if (!price) {
      setError(prev => ({
        ...prev,
        title: '',
        price: 'Price is required',
        description: '',
        paymentType: '',
        paymentInterval: '',
      }));
    } else if (!title) {
      setError(prev => ({
        ...prev,
        title: 'Title is required',
        price: '',
        description: '',
        paymentType: '',
        paymentInterval: '',
      }));
    } else if (!description) {
      setError(prev => ({
        ...prev,
        title: '',
        price: '',
        description: 'Description is required',
        paymentType: '',
        paymentInterval: '',
      }));
    } else if (isSubscription && !paymentInterval) {
      setError(prev => ({
        ...prev,
        title: '',
        price: '',
        description: '',
        paymentType: '',
        paymentInterval: 'Payment Interval is required',
      }));
    } else {
      let imageId;
      let imageUrl;

      if (image.length) {
        setUpload(true);
        const response = await uploadFiles(image);
        imageUrl = prefixFileUrlWithBackendUrl(response.data[0].url);
        imageId = response.data[0].id;
      }
      setUpload(false);
      await handleClickSave(
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
      setTitle('');
      setPrice();
      setImage([]);
      setDescription('');
      setIsSubscription(false);
      setPaymentInterval('');
      setTrialPeriodDays('');
      setPaymentType('');
      setIsFreeAmount(false);
      setError({});
    }
  }, [title, price, image, description, isSubscription, isFreeAmount, paymentInterval, trialPeriodDays, paymentType]);

  return (
    <Box>
      {isVisible && (
        <ModalLayout onClose={handleClose} labelledBy="title">
          <ModalHeader>
            <Flex direction="column" justifyContent="start" alignItems="start">
              <Typography
                fontWeight="bold"
                textColor="neutral800"
                as="h2"
                id="title"
                variant="beta"
              >
                Créer un {heading.toLowerCase()}
              </Typography>

              <Box>
                <Typography variant="omega">
                  {heading === 'Produit'
                    ? 'Pour un produit, le donateur effectue un seul paiement'
                    : 'Pour un abonnement, le donateur effectue un paiement périodiquement'}
                </Typography>
              </Box>
            </Flex>
          </ModalHeader>
          <ModalBody>
            <Grid gap={5}>
              <GridItem col={6}>
                <Select
                  id="select1"
                  label="Type de donation"
                  required
                  clearLabel="Supprimer le type de donation"
                  hint="Ex: simple ou récurrente"
                  error={error.paymentType ? error.paymentType : ''}
                  onClear={() => setPaymentType('')}
                  onChange={value => handleChangePaymentType(value)}
                  value={paymentType}
                >
                  <Option value="oneTime">Donation simple</Option>
                  <Option value="subscription">Donation récurrente</Option>
                </Select>
              </GridItem>
              <GridItem col={6}>
                <Stack spacing={1}>
                  <NumberInput
                    label="Prix"
                    name="price"
                    onValueChange={value => handleChangeNumber(value)}
                    value={price}
                    error={error.price ? error.price : ''}
                    required
                  />
                  {price > 0 ? <ToggleCheckbox style={{ width: '100%' }} size="M" onLabel="Montant libre" offLabel={`Montant fixe de ${price ?? 0}€`} checked={isFreeAmount} onChange={() => setIsFreeAmount(prev => !prev)} /> : null}
                </Stack>
              </GridItem>
              <GridItem col={6}>
                <TextInput
                  label="Titre"
                  name="title"
                  onChange={handleChange}
                  error={error.title ? error.title : ''}
                  required
                />
              </GridItem>
              <GridItem col={6}>
                <Typography variant="pi" fontWeight="bold">
                  Image <Typography textColor="danger700">&#42;</Typography>
                </Typography>

                <Box paddingTop={3}>
                  <input type="file" name="image" onChange={handleChange} accept="image/*" />
                </Box>
                {error.image ? (
                  <Typography variant="pi" textColor="danger700">
                    {error.image}
                  </Typography>
                ) : (
                  ''
                )}
              </GridItem>
              <GridItem col={12}>
                <Textarea
                  label="Description"
                  name="description"
                  onChange={handleChange}
                  error={error.description ? error.description : ''}
                  required
                >
                  {description}
                </Textarea>
              </GridItem>
              <GridItem col={6}>
                <Select
                  id="select2"
                  label="Périodicité"
                  required={isSubscription}
                  disabled={!isSubscription}
                  clearLabel="Supprimer la périodicité"
                  hint="Périodicité de la donation : hebdomadaire, mensuel ou annuel."
                  error={error.paymentInterval ? error.paymentInterval : ''}
                  onClear={() => setPaymentInterval('')}
                  onChange={value => handleChangePaymentInterval(value)}
                  value={paymentInterval}
                >
                  <Option value="month">Mensuel</Option>
                  <Option value="year">Annuel</Option>
                  <Option value="week">Hebdomadaire</Option>
                </Select>
              </GridItem>
              <GridItem col={6}>
                <NumberInput
                  label="Période d'essai gratuite"
                  name="trialPeriodDays"
                  disabled={!isSubscription}
                  hint="Période durant laquelle l'abonnement est gratuit."
                  onValueChange={value => handleChangeTrialPeriod(value)}
                  value={trialPeriodDays}
                />
              </GridItem>
            </Grid>
          </ModalBody>
          <ModalFooter
            startActions={
              <Button onClick={handleClose} variant="tertiary">
                Annuler
              </Button>
            }
            endActions={
              upload ? (
                <Flex justifyContent="center">
                  <Loader small>Chargement...</Loader>
                  <Typography fontWeight="bold" textColor="primary600" as="h2">
                    L'image est en cours de téléversement...
                  </Typography>
                </Flex>
              ) : (
                <Button variant="default" onClick={handleSaveProduct}>
                  Créer
                </Button>
              )
            }
          />
        </ModalLayout>
      )}
    </Box>
  );
};

CreateProduct.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  handleClickSave: PropTypes.func.isRequired,
};

export default CreateProduct;
