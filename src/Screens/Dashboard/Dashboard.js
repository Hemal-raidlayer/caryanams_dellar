import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
  Image,
  StatusBar,
  Platform,
  Alert,
  PermissionsAndroid,
  Modal,
} from 'react-native';
import colors from '../../Utils/colors';
import fonts from '../../Utils/fonts';
import image from '../../Utils/images';
import { Dropdown } from 'react-native-element-dropdown';
import DatePicker from 'react-native-date-picker';
import ImagePicker from 'react-native-image-crop-picker';
import OptionSelector from '../../Component/OptionSelector';
import { SafeAreaView } from 'react-native-safe-area-context';
import api from '../../../api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import CoustomToast from '../../Component/CoustomToast';
import Strings from '../../constants/strings';

const Dashboard = () => {
  // Fetch token
  const printToken = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (token) {
        // console.log('Fetched token:', token);
        setToken(token);
      } else {
        console.log('No token found');
      }
    } catch (error) {
      console.log('Error fetching token:', error);
    }
  };

  // Details submit Api  Start
  const apiData = async () => {
    try {
      const payload = {
        appName: 'app5347583724521',
        collectionToSubmit: 'usecar',
        sectionName: 'usecar',
        sectionData: {
          Brand: Brand?.brandname,
          Modal: CarModal?.name,
          Variant: Variant?.variantname,
          Year: Year?.value,
          Fuel: Fuel,
          Transmission: Transmission,
          Owner: Owner,
          KmDrive: KmDrive,
          CarNumber: CarNumber,
          Insurance: Insurance,
          insuranceStartDate: insuranceStartDate,
          insuranceEndDate: insuranceEndDate,
          ChassicNumber: ChassicNumber,
          lastServiceDate: lastServiceDate,
          Accidental: Accidental?.value,
          Key: Key,
          Description: Description,
        },
      };

      console.log(
        ' Submitted Values:',
        JSON.stringify(payload.sectionData, null, 2),
      );

      console.log(' Full Payload:', JSON.stringify(payload, null, 2));

      const response = await api.post('v1/dynamic/submitData', payload);
      console.log('API Success:', response);
      return response;
    } catch (error) {
      console.log('API Error:', error);
      throw error;
    }
  };
  // Details submit Api  Over

  // State variables
  const [openIndex, setOpenIndex] = useState(null);
  const [openStart, setOpenStart] = useState(false);
  const [openEnd, setOpenEnd] = useState(false);
  const [openService, setOpenService] = useState(false);
  const [dummyPhotos, setDummyPhotos] = useState([]);
  const [showPicker, setShowPicker] = useState(false);
  const [AllPhotod, setsetAllPhotod] = useState([]);
  const [showFrontPicker, setShowFrontPicker] = useState(false);

  // Details
  const [Brand, setBrand] = useState(null);
  const [CarModal, setCarModal] = useState(null);
  const [Variant, setVariant] = useState(null);
  const [Year, setYear] = useState(null);
  const [Fuel, setFuel] = useState('');
  const [Transmission, setTransmission] = useState('');
  const [Owner, setOwner] = useState('');
  const [KmDrive, setKmDrive] = useState('');
  const [CarNumber, setCarNumber] = useState('');
  const [Insurance, setInsurance] = useState('');
  const [insuranceStartDate, setInsuranceStartDate] = useState('');
  const [insuranceEndDate, setInsuranceEndDate] = useState('');
  const [ChassicNumber, setChassicNumber] = useState('');
  const [lastServiceDate, setLastServiceDate] = useState('');
  const [Accidental, setAccidental] = useState(null);
  const [Key, setKey] = useState('');
  const [Description, setDescription] = useState('');

  // Location section
  const [State, setState] = useState(false);
  const [City, setCity] = useState(false);
  const [Area, setArea] = useState(false);
  const [Rto, setRto] = useState(false);

  // Review Details
  const [Name, setName] = useState(false);
  const [Mobile, setMobile] = useState(false);

  const [brandList, setbrandList] = useState([]);
  const [ModelList, setModelList] = useState([]);
  const [VariantList, setVariantList] = useState([]);
  const [Token, setToken] = useState(null);
  const [maxOpenIndex, setMaxOpenIndex] = useState(0); 

  // BrandList Playload start

  const brandListPayload = {
    lookups: [
      {
        db: 'caryanams',
        data: [
          {
            table: 'newbrand',
            query: {},
            projection: {
              _id: 0,
              brandId: '$_id',
              brandname: '$sectionData.newBrand.brandname',
            },
            label: 'BrandList',
            type: 'array',
            lookup: [],
          },
        ],
      },
    ],
  };
  // BrandList Playload over

  // ModelList Playload start

  const ModelListPayload = brandId => ({
    lookups: [
      {
        db: 'caryanams',
        data: [
          {
            table: 'model',
            query: {},
            projection: {
              _id: 0,
              modelId: '$_id',
              name: '$sectionData.model.name',
              companyId: '$sectionData.model.companyId',
            },
            label: 'modelList',
            type: 'array',
            lookup: [],
          },
        ],
      },
    ],
  });

  // ModelList Playload over

  // variant Playload start

  const VariantListPayload = modelId => ({
    lookups: [
      {
        db: 'caryanams',
        data: [
          {
            table: 'variant',
            query: { 'sectionData.variant.model': modelId },
            projection: {
              _id: 0,
              variantId: '$_id',
              variantname: '$sectionData.variant.name',
            },
            label: 'variantList',
            type: 'array',
            lookup: [],
          },
        ],
      },
    ],
  });
  // variant Playload over

  //  car Api start

  const fetchBrands = async () => {
    try {
      const response = await api.post('v2/dynamic/process', brandListPayload);
      console.log('brandList Response:', response);

      const ApiBrandList = response?.data?.[0]?.BrandList || [];
      setbrandList(ApiBrandList);
      console.log('ApiBrandList >>>>', ApiBrandList);
    } catch (err) {
      console.error('Error fetching brandList:', err);
    }
  };

  const handleSelectBrand = async selectedBrand => {
    setBrand(selectedBrand);
    console.log('Selected Brand >>>', selectedBrand);

    setModelList([]);
    setVariantList([]);
    setCarModal(null);
    setVariant(null);

    try {
      const response = await api.post(
        'v2/dynamic/process',
        ModelListPayload(selectedBrand.brandId),
      );

      const ApiModelList = response?.data?.[0]?.modelList || [];
      setModelList(ApiModelList);
      console.log('ApiModelList >>>>', ApiModelList);
    } catch (err) {
      console.error('Error fetching ModelList:', err);
    }
  };

  const handleSelectModel = async selectedModel => {
    setCarModal(selectedModel);

    setVariantList([]);
    setVariant(null);

    console.log('Selected Car model', selectedModel);

    try {
      const response = await api.post(
        'v2/dynamic/process',
        VariantListPayload(selectedModel.modelId),
      );

      const ApiVariantList = response?.data?.[0]?.variantList || [];
      setVariantList(ApiVariantList);
      console.log('ApiVariantList >>>>', ApiVariantList);
    } catch (err) {
      console.error('Error fetching VariantList:', err);
    }
  };

  //  car Api over

  useEffect(() => {
    printToken();
    fetchBrands();
  }, []);

  // validation start
  const validateSection = index => {
    switch (index) {
      case 0: // Front Photo
        if (!AllPhotod.length) {
          CoustomToast(
            Strings.errorTitle,
            Strings.validation,
            Strings.photoValidationFront,
          );
          return false;
        }
        break;

      case 1: // All Photos
        if (!dummyPhotos.length) {
          CoustomToast(
            Strings.errorTitle,
            Strings.validation,
            Strings.photoValidationAll,
          );
          return false;
        }
        break;

      case 2: // Details
        if (
          !Brand ||
          !CarModal ||
          !Variant ||
          !Year ||
          !Fuel ||
          !Transmission ||
          !Owner ||
          !KmDrive ||
          !CarNumber ||
          !Description
        ) {
          CoustomToast(
            Strings.errorTitle,
            Strings.validation,
            Strings.detailsValidation,
          );
          return false;
        }
        break;

      case 3: // Location
        if (!State || !City || !Area || !Rto) {
          CoustomToast(
            Strings.errorTitle,
            Strings.validation,
            Strings.locationValidation,
          );
          return false;
        }
        break;

      case 4: // Review
        if (!Name || !Mobile) {
          CoustomToast(
             Strings.errorTitle,
            Strings.validation,
            Strings.reviewValidation
          );
          return false;
        }
        break;

      default:
        return true;
    }

    return true;
  };
  // Validation Over

  // json data start
  const getFormDataAsJSON = () => {
    const formData = {
      photos: {
        frontPhotos: AllPhotod,
        allPhotos: dummyPhotos,
      },
      details: {
        brand: Brand,
        model: CarModal,
        variant: Variant,
        year: Year,
        fuel: Fuel,
        transmission: Transmission,
        owner: Owner,
        kmDriven: KmDrive,
        carNumber: CarNumber,
        insurance: Insurance,
        insuranceStartDate: insuranceStartDate
          ? insuranceStartDate.toISOString()
          : null,
        insuranceEndDate: insuranceEndDate
          ? insuranceEndDate.toISOString()
          : null,
        chassisNumber: ChassicNumber,
        lastServiceDate: lastServiceDate ? lastServiceDate.toISOString() : null,
        accidental: Accidental,
        duplicateKey: Key,
        description: Description,
      },
      location: {
        state: State,
        city: City,
        area: Area,
        rto: Rto,
      },
      user: {
        name: Name,
        mobile: Mobile,
      },
    };

    console.log('Form JSON >>>', JSON.stringify(formData, null, 2)); // pretty print
    return formData;
  };

  // json data over

  // Dummy data for dropdowns
  const dummyOptions = [
    { label: 'Option 1', value: '1' },
    { label: 'Option 2', value: '2' },
  ];

  const transmissionOptions = [
    { label: 'Manual', value: 'manual' },
    { label: 'Automatic', value: 'automatic' },
  ];

  const fuels = [
    { label: 'CNG & Hybrids', value: 'cng' },
    { label: 'Diesel', value: 'diesel' },
    { label: 'Electric', value: 'electric' },
    { label: 'LPG', value: 'lpg' },
    { label: 'Petrol', value: 'petrol' },
  ];

  const OwnerList = [
    { label: '1st', value: '1st' },
    { label: '2nd', value: '2nd' },
    { label: '3rd', value: '3rd' },
    { label: '4th', value: '4th' },
    { label: '4+', value: '4+' },
  ];

  const InsuranceList = [
    { label: 'Yes', value: 'yes' },
    { label: 'No', value: 'no' },
  ];

  const AccidentalList = [
    { label: 'Yes', value: 'yes' },
    { label: 'No', value: 'no' },
  ];

  const KeyList = [
    { label: '0', value: '0' },
    { label: '1', value: '1' },
    { label: '2', value: '2' },
    { label: '2+', value: '2+' },
  ];

  // Render photo grid without FlatList
  const renderPhotoGrid = (photos, setPhotos) => {
    return (
      <View style={styles.photoGrid}>
        {photos.map((item, index) => (
          <View key={item.id || index} style={styles.photoItem}>
            <Image source={{ uri: item.uri }} style={styles.photoImage} />
            <TouchableOpacity
              style={styles.removeBtn}
              onPress={() => {
                setPhotos(prev => prev.filter(photo => photo.id !== item.id));
              }}
            >
              <Text style={{ color: '#fff', fontSize: 12 }}>{Strings.cancle}</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>
    );
  };

  const handleCameraCapture = async (setPhotos, setShowModal) => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: Strings.cameraPermissionTitle,
          message: Strings.cameraPermissionMessage,
          buttonPositive: Strings.ok,
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        const image = await ImagePicker.openCamera({
          width: 300,
          height: 300,
          cropping: false,
          mediaType: 'photo',
        });
        const newPhoto = {
          id: Date.now().toString(),
          uri: image.path,
        };
        setPhotos(prev => [...prev, newPhoto]);
        setShowModal(false);
      }
    } catch (error) {
      console.log('Camera error:', error);
    }
  };

  const handleGalleryPick = async (setPhotos, setShowModal) => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        {
          title: Strings.galaryPermissionTitile,
          message: Strings.galaryPermissionMessage,
          buttonPositive: Strings.ok
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        const image = await ImagePicker.openPicker({
          width: 300,
          height: 300,
          cropping: false,
          mediaType: 'photo',
        });
        const newPhoto = {
          id: Date.now().toString(),
          uri: image.path,
        };
        setPhotos(prev => [...prev, newPhoto]);
        setShowModal(false);
      }
    } catch (error) {
      console.log('Gallery error:', error);
    }
  };

  const toggleAccordion = index => {
    if (index <= maxOpenIndex) {
      setOpenIndex(openIndex === index ? -1 : index); // open/close current unlocked section
    } else {
      // Trying to open a locked section
      CoustomToast(
        Strings.infoTitle,
        Strings.stepLocked,
        Strings.previoudStepValidation,
      );
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle={'dark-content'} backgroundColor={colors.white} />
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>{Strings.dashboardTitle}</Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled={true}
        keyboardShouldPersistTaps="handled"
        style={{ paddingHorizontal: 12, marginTop: 12 }}
      >
        {/* Front Photo Section */}
        <SafeAreaView style={styles.accordionContainer}>
          <TouchableOpacity
            style={[
              styles.accordionHeader,
              openIndex === 0 && styles.activeHeader,
            ]}
            onPress={() => toggleAccordion(0)}
          >
            <Text style={styles.accordionTitle}>{Strings.frontPhotoTitle}</Text>
            <Image
              source={openIndex === 0 ? image.down : image.up_arrow}
              style={{ height: 18, width: 18 }}
              resizeMode="contain"
            />
          </TouchableOpacity>

          {openIndex === 0 && maxOpenIndex >= 0 && (
            <View style={styles.accordionContent}>
              {renderPhotoGrid(AllPhotod, setsetAllPhotod)}

              <TouchableOpacity
                style={styles.addPhotoBox}
                onPress={() => setShowFrontPicker(true)}
              >
                <View style={styles.addPhotoContent}>
                  <Image
                    source={image.camera_1}
                    style={{ height: 30, width: 30, marginBottom: 5 }}
                    tintColor={colors.primary}
                  />
                  <Text style={styles.addPhotoText}>{Strings.addPhoto}</Text>
                </View>
              </TouchableOpacity>

              {/* Photo Picker Modal */}
              <Modal
                transparent
                visible={showFrontPicker}
                animationType="slide"
                onRequestClose={() => setShowFrontPicker(false)}
              >
                <TouchableOpacity
                  style={styles.modalOverlay}
                  activeOpacity={1}
                  onPressOut={() => setShowFrontPicker(false)}
                >
                  <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>{Strings.chooseOption}</Text>

                    <TouchableOpacity
                      style={styles.modalBtn}
                      onPress={() =>
                        handleCameraCapture(setsetAllPhotod, setShowFrontPicker)
                      }
                    >
                      <Text style={styles.modalBtnText}>📷 {Strings.camera}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.modalBtn}
                      onPress={() =>
                        handleGalleryPick(setsetAllPhotod, setShowFrontPicker)
                      }
                    >
                      <Text style={styles.modalBtnText}>🖼️ {Strings.gallery}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[styles.modalBtn, { backgroundColor: '#ddd' }]}
                      onPress={() => setShowFrontPicker(false)}
                    >
                      <Text style={[styles.modalBtnText, { color: '#000' }]}>
                        Cancel
                      </Text>
                    </TouchableOpacity>
                  </View>
                </TouchableOpacity>
              </Modal>

              <View style={{ marginTop: 10, alignSelf: 'flex-end' }}>
                <TouchableOpacity
                  activeOpacity={0.6}
                  style={styles.nextbtn}
                  // onPress={() => toggleAccordion(1)}
                  onPress={() => {
                    if (validateSection(openIndex)) {
                      const jsonData = getFormDataAsJSON(); //  store JSON
                      // Unlock next section
                      setMaxOpenIndex(prev => Math.max(prev, openIndex + 1));
                      // Open next section automatically
                      setOpenIndex(openIndex + 1);
                      CoustomToast(
                        'success',
                        'Step Completed',
                        'You can now fill the next section',
                      );
                    }
                  }}
                >
                  <Text style={styles.text_Next}>{Strings.next}</Text>
                  <Image
                    source={image.right}
                    style={{ height: 18, width: 18 }}
                    tintColor={colors.white}
                  />
                </TouchableOpacity>
              </View>
            </View>
          )}
        </SafeAreaView>

        {/* All Photos Section */}
        <SafeAreaView style={styles.accordionContainer}>
          <TouchableOpacity
            style={[
              styles.accordionHeader,
              openIndex === 1 && styles.activeHeader,
            ]}
            onPress={() => toggleAccordion(1)}
          >
            <Text style={styles.accordionTitle}>{Strings.allPhotos}</Text>
            <Image
              source={openIndex === 1 ? image.down : image.up_arrow}
              style={{ height: 18, width: 18 }}
              resizeMode="contain"
            />
          </TouchableOpacity>

          {openIndex === 1 && maxOpenIndex >= 1 && (
            <View style={styles.accordionContent}>
              {renderPhotoGrid(dummyPhotos, setDummyPhotos)}

              <TouchableOpacity
                style={styles.addPhotoBox}
                onPress={() => setShowPicker(true)}
              >
                <Image
                  source={image.camera_1}
                  style={{ height: 30, width: 30 }}
                  tintColor={colors.primary}
                />
                <Text style={styles.addPhotoText}>{Strings.addPhoto}</Text>
              </TouchableOpacity>

              {/* Photo Picker Modal */}
              <Modal
                transparent
                visible={showPicker}
                animationType="slide"
                onRequestClose={() => setShowPicker(false)}
              >
                <TouchableOpacity
                  style={styles.modalOverlay}
                  activeOpacity={1}
                  onPressOut={() => setShowPicker(false)}
                >
                  <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>{Strings.chooseOption}</Text>

                    <TouchableOpacity
                      style={styles.modalBtn}
                      onPress={() =>
                        handleCameraCapture(setDummyPhotos, setShowPicker)
                      }
                    >
                      <Text style={styles.modalBtnText}>📷 {Strings.camera}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.modalBtn}
                      onPress={() =>
                        handleGalleryPick(setDummyPhotos, setShowPicker)
                      }
                    >
                      <Text style={styles.modalBtnText}>🖼️  {Strings.gallery}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[styles.modalBtn, { backgroundColor: '#ddd' }]}
                      onPress={() => setShowPicker(false)}
                    >
                      <Text style={[styles.modalBtnText, { color: '#000' }]}>
                        Cancel
                      </Text>
                    </TouchableOpacity>
                  </View>
                </TouchableOpacity>
              </Modal>

              <View style={{ marginTop: 10, alignSelf: 'flex-end' }}>
                <TouchableOpacity
                  activeOpacity={0.6}
                  style={styles.nextbtn}
                  // onPress={() => toggleAccordion(2)}
                  onPress={() => {
                    if (validateSection(openIndex)) {
                      const jsonData = getFormDataAsJSON(); //  store JSON
                      // Unlock next section
                      setMaxOpenIndex(prev => Math.max(prev, openIndex + 1));
                      // Open next section automatically
                      setOpenIndex(openIndex + 1);
                      CoustomToast(
                        'success',
                        'Step Completed',
                        'You can now fill the next section',
                      );
                    }
                  }}
                >
                  <Text style={styles.text_Next}> {Strings.next}</Text>
                  <Image
                    source={image.right}
                    style={{ height: 18, width: 18 }}
                    tintColor={colors.white}
                  />
                </TouchableOpacity>
              </View>
            </View>
          )}
        </SafeAreaView>

        {/* Details Section */}
        <SafeAreaView style={styles.accordionContainer}>
          <TouchableOpacity
            style={[
              styles.accordionHeader,
              openIndex === 2 && styles.activeHeader,
            ]}
            onPress={() => toggleAccordion(2)}
          >
            <Text style={styles.accordionTitle}>{Strings.detailsectionTitle}</Text>
            <Image
              source={openIndex === 2 ? image.down : image.up_arrow}
              style={{ height: 18, width: 18 }}
              resizeMode="contain"
            />
          </TouchableOpacity>

          {openIndex === 2 && maxOpenIndex >= 2 && (
            <View style={styles.accordionContent}>
              {/* Brands */}
              <View style={{ zIndex: 1000, marginVertical: 10 }}>
                <Text style={{ color: 'red' }}>{Strings.mandatoryMark}</Text>
                <Dropdown
                  style={styles.dropdown}
                  data={brandList.map(b => ({
                    label: b.brandname,
                    value: b.brandId,
                  }))}
                  labelField="label"
                  valueField="value"
                  placeholder={Strings.brandTitle}
                  value={Brand?.brandId}
                  onChange={item => {
                    const selectedBrand = brandList.find(
                      b => b.brandId === item.value,
                    );
                    handleSelectBrand(selectedBrand);
                  }}
                  maxHeight={300}
                  showsVerticalScrollIndicator={false}
                />
              </View>

              {/* Model */}
              <View style={{ zIndex: 900, marginVertical: 10 }}>
                <Text style={{ color: 'red' }}>{Strings.mandatoryMark}</Text>
                <Dropdown
                  style={styles.dropdown}
                  data={ModelList.map(m => ({
                    label: m.name,
                    value: m.modelId,
                  }))}
                  labelField="label"
                  valueField="value"
                  placeholder={Strings.modalTitle}
                  value={CarModal?.modelId}
                  onChange={item => {
                    const selectedModel = ModelList.find(
                      m => m.modelId === item.value,
                    );
                    handleSelectModel(selectedModel);
                  }}
                  disabled={!Brand} // Disable if no brand selected
                  maxHeight={300}
                  showsVerticalScrollIndicator={false}
                />
              </View>

              {/* Variant   */}
              <View style={{ zIndex: 800, marginVertical: 10 }}>
                <Text style={{ color: 'red' }}>{Strings.mandatoryMark}</Text>
                <Dropdown
                  style={styles.dropdown}
                  data={VariantList.map(v => ({
                    label: v.variantname,
                    value: v.variantId,
                  }))}
                  labelField="label"
                  valueField="value"
                  placeholder={Strings.varientTitle}
                  value={Variant?.variantId}
                  onChange={item => {
                    const selectedVariant = VariantList.find(
                      v => v.variantId === item.value,
                    );
                    setVariant(selectedVariant);
                    console.log('Selected Variant', selectedVariant);
                  }}
                  disabled={!CarModal}
                  maxHeight={300}
                  showsVerticalScrollIndicator={false}
                />
              </View>

              <View>
                <Text style={{ color: 'red' }}>{Strings.mandatoryMark}</Text>
                <Dropdown
                  style={styles.dropdown}
                  data={dummyOptions}
                  labelField="label"
                  valueField="value"
                  placeholder={Strings.PlaceholderYear}
                  value={Year}
                  onChange={value => {
                    setYear(value);
                    console.log('Selected Year', value);
                  }}
                />
              </View>

              <View>
                <Text style={{ color: 'red' }}>{Strings.mandatoryMark}</Text>
                <OptionSelector
                  title={Strings.FuelTitle}
                  options={fuels}
                  multiSelect={false}
                  onSelect={value => {
                    setFuel(value);
                  }}
                />
              </View>

              <View>
                <Text style={{ color: 'red' }}>{Strings.mandatoryMark}</Text>
                <OptionSelector
                  title={Strings.tramsmissionTitle}
                  options={transmissionOptions}
                  multiSelect={false}
                  onSelect={value => {
                    setTransmission(value);
                  }}
                />
              </View>

              <View>
                <Text style={{ color: 'red' }}>{Strings.mandatoryMark}</Text>
                <OptionSelector
                  title={Strings.ownerTitle}
                  options={OwnerList}
                  multiSelect={false}
                  onSelect={value => {
                    setOwner(value);
                  }}
                />
              </View>

              <View>
                <Text style={{ color: 'red' }}>{Strings.mandatoryMark}</Text>
                <TextInput
                  style={[
                    styles.input,
                    { color: colors.black, fontFamily: fonts.medium },
                  ]}
                  placeholder={Strings.PlaceholdetKilomiter}
                  placeholderTextColor={colors.darkgray}
                  value={KmDrive}
                  onChangeText={value => {
                    setKmDrive(value);
                  }}
                />
              </View>

              <View>
                <Text style={{ color: 'red' }}>{Strings.mandatoryMark}</Text>
                <TextInput
                  style={[
                    styles.input,
                    { color: colors.black, fontFamily: fonts.medium },
                  ]}
                  placeholder={Strings.PlaceholderCarNumber}
                  placeholderTextColor={colors.darkgray}
                  value={CarNumber}
                  onChangeText={value => {
                    setCarNumber(value);
                  }}
                />
              </View>

              <OptionSelector
                title={Strings.insuranceTitle}
                options={InsuranceList}
                multiSelect={false}
                onSelect={value => {
                  setInsurance(value);
                }}
              />

              {/* Insurance start Date */}
              <View style={{ marginTop: 10, width: '100%' }}>
                <TouchableOpacity
                  style={[
                    styles.input,
                    {
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    },
                  ]}
                  onPress={() => setOpenStart(true)}
                  activeOpacity={0.7}
                >
                  <Text>
                    {insuranceStartDate
                      ? insuranceStartDate.toDateString()
                      :Strings.placeholderInsuranceStartDate}
                  </Text>
                  <Image
                    source={image.down}
                    style={styles.downArrow}
                    resizeMode="contain"
                    tintColor={colors.primary}
                  />
                </TouchableOpacity>
              </View>

              <DatePicker
                modal
                open={openStart}
                date={insuranceStartDate || new Date()}
                mode="date"
                onConfirm={selectedDate => {
                  setOpenStart(false);
                  setInsuranceStartDate(selectedDate);
                  console.log(
                    Strings.placeholderInsuranceStartDate,
                    selectedDate.toDateString(),
                  );
                }}
                onCancel={() => setOpenStart(false)}
              />

              {/* Insurance End Date */}
              <View style={{ marginTop: 10, width: '100%' }}>
                <TouchableOpacity
                  style={[
                    styles.input,
                    {
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    },
                  ]}
                  onPress={() => setOpenEnd(true)}
                  activeOpacity={0.7}
                >
                  <Text>
                    {insuranceEndDate
                      ? insuranceEndDate.toDateString()
                      :Strings.placeholderInsuranceEndDate}
                  </Text>
                  <Image
                    source={image.down}
                    style={styles.downArrow}
                    resizeMode="contain"
                    tintColor={colors.primary}
                  />
                </TouchableOpacity>
              </View>

              <DatePicker
                modal
                open={openEnd}
                date={insuranceEndDate || new Date()}
                mode="date"
                onConfirm={selectedDate => {
                  setOpenEnd(false);
                  setInsuranceEndDate(selectedDate);
                  console.log(
                    Strings.placeholderInsuranceEndDate,
                    selectedDate.toDateString(),
                  );
                }}
                onCancel={() => setOpenEnd(false)}
              />

              <TextInput
                style={[
                  styles.input,
                  { color: colors.black, fontFamily: fonts.medium },
                ]}
                placeholder={Strings.placeholderChassis}
                placeholderTextColor={colors.darkgray}
                value={ChassicNumber}
                onChangeText={value => {
                  setChassicNumber(value);
                }}
              />

              {/* Last Service Date */}
              <View style={{ marginTop: 10, width: '100%' }}>
                <TouchableOpacity
                  style={[
                    styles.input,
                    {
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    },
                  ]}
                  onPress={() => setOpenService(true)}
                  activeOpacity={0.7}
                >
                  <Text>
                    {lastServiceDate
                      ? lastServiceDate.toDateString()
                      : Strings.placeholderInsuranceEndDate}
                  </Text>
                  <Image
                    source={image.down}
                    style={styles.downArrow}
                    resizeMode="contain"
                    tintColor={colors.primary}
                  />
                </TouchableOpacity>
              </View>

              <DatePicker
                modal
                open={openService}
                date={lastServiceDate || new Date()}
                mode="date"
                onConfirm={selectedDate => {
                  setOpenService(false);
                  setLastServiceDate(selectedDate);
                  console.log(
                    'Selected Last Services Date:',
                    selectedDate.toDateString(),
                  );
                }}
                onCancel={() => setOpenService(false)}
              />

              <OptionSelector
                title={Strings.accidentalTitle}
                options={AccidentalList}
                multiSelect={false}
                onSelect={value => {
                  setAccidental(value);
                }}
              />

              <OptionSelector
                title={Strings.keyTitle}
                options={KeyList}
                multiSelect={false}
                onSelect={value => {
                  setKey(value);
                }}
              />

              <View style={{ marginBottom: 5 }}>
                <Text style={{ color: 'red' }}>{Strings.mandatoryMark}</Text>
                <TextInput
                  style={[
                    styles.input,
                    {
                      paddingVertical: 10,
                      height: 100,
                      textAlignVertical: 'top',
                      color: colors.black,
                      fontFamily: fonts.medium,
                    },
                  ]}
                  placeholder={Strings.PlaceholderDescription}
                  placeholderTextColor={colors.darkgray}
                  value={Description}
                  onChangeText={value => {
                    setDescription(value);
                    console.log('Description >>', value);
                  }}
                  multiline
                />
              </View>

              <View style={{ marginTop: 10, alignSelf: 'flex-end' }}>
                <TouchableOpacity
                  activeOpacity={0.6}
                  style={styles.nextbtn}
                  // onPress={apiData}
                  onPress={() => {
                    if (validateSection(openIndex)) {
                      const jsonData = getFormDataAsJSON(); // store JSON
                      // Unlock next section
                      setMaxOpenIndex(prev => Math.max(prev, openIndex + 1));
                      // Open next section automatically
                      setOpenIndex(openIndex + 1);
                      CoustomToast(
                        Strings.successTitle,
                        Strings.stepComplated,
                        Strings.fillNextSection,
                      );
                    }
                  }}
                >
                  <Text style={styles.text_Next}>{Strings.next}</Text>
                  <Image
                    source={image.right}
                    style={{ height: 18, width: 18 }}
                    tintColor={colors.white}
                  />
                </TouchableOpacity>
              </View>
            </View>
          )}
        </SafeAreaView>

        {/* Location Section */}
        <SafeAreaView style={styles.accordionContainer}>
          <TouchableOpacity
            style={[
              styles.accordionHeader,
              openIndex === 3 && styles.activeHeader,
            ]}
            onPress={() => toggleAccordion(3)}
          >
            <Text style={styles.accordionTitle}>{Strings.locationSectionTitle}</Text>
            <Image
              source={openIndex === 3 ? image.down : image.up_arrow}
              style={{ height: 18, width: 18 }}
              resizeMode="contain"
            />
          </TouchableOpacity>
          {openIndex === 3 && maxOpenIndex >= 3 && (
            <View style={styles.accordionContent}>
              <Dropdown
                style={styles.dropdown}
                data={dummyOptions}
                labelField="label"
                valueField="value"
                placeholder={Strings.stateTitle}
                value={State}
                onChange={value => {
                  setState(value);
                  console.log('Selected State >>>>', value);
                }}
              />
              <Dropdown
                style={styles.dropdown}
                data={dummyOptions}
                labelField="label"
                valueField="value"
                placeholder={Strings.cityTitle}
                value={City}
                onChange={value => {
                  setCity(value);
                  console.log('Selected City >>>>', value);
                }}
              />
              <Dropdown
                style={styles.dropdown}
                data={dummyOptions}
                labelField="label"
                valueField="value"
                placeholder="Select Area"
                value={Area}
                onChange={value => {
                  setArea(value);
                  console.log('Selected Area >>>>', value);
                }}
              />
              <Dropdown
                style={styles.dropdown}
                data={dummyOptions}
                labelField="label"
                valueField="value"
                placeholder={Strings.rtoTitle}
                value={Rto}
                onChange={value => {
                  setRto(value);
                  console.log('Selected Rto >>>>', value);
                }}
              />

              <View style={{ marginTop: 10, alignSelf: 'flex-end' }}>
                <TouchableOpacity
                  activeOpacity={0.6}
                  style={styles.nextbtn}
                  // onPress={() => toggleAccordion(4)}
                  onPress={() => {
                    if (validateSection(openIndex)) {
                      const jsonData = getFormDataAsJSON(); //  store JSON
                      // Unlock next section
                      setMaxOpenIndex(prev => Math.max(prev, openIndex + 1));
                      // Open next section automatically
                      setOpenIndex(openIndex + 1);
                      CoustomToast(
                        'success',
                        'Step Completed',
                        'You can now fill the next section',
                      );
                    }
                  }}
                >
                  <Text style={styles.text_Next}>{Strings.next}</Text>
                  <Image
                    source={image.right}
                    style={{ height: 18, width: 18 }}
                    tintColor={colors.white}
                  />
                </TouchableOpacity>
              </View>
            </View>
          )}
        </SafeAreaView>

        {/* Review Details Section */}
        <SafeAreaView style={styles.accordionContainer}>
          <TouchableOpacity
            style={[
              styles.accordionHeader,
              openIndex === 4 && styles.activeHeader,
            ]}
            onPress={() => toggleAccordion(4)}
          >
            <Text style={styles.accordionTitle}>{Strings.reviewSectionTitle}</Text>
            <Image
              source={openIndex === 4 ? image.down : image.up_arrow}
              style={{ height: 18, width: 18 }}
              resizeMode="contain"
            />
          </TouchableOpacity>
          {openIndex === 4 && maxOpenIndex >= 4 && (
            <View style={styles.accordionContent}>
              <Text style={styles.heading}>Let's verify your account</Text>
              <View style={styles.avatarContainer}>
                <Image
                  source={image.profile2}
                  style={styles.avatarImage}
                  resizeMode="contain"
                />
                <TextInput
                  style={[
                    styles.input,
                    {
                      flex: 1,
                      marginLeft: 10,
                      color: colors.black,
                      fontFamily: fonts.medium,
                    },
                  ]}
                  placeholder={Strings.name}
                  value={Name}
                  onChangeText={value => {
                    setName(value);
                    console.log('Selected Name >>>>', value);
                  }}
                />
              </View>
              <TextInput
                style={[
                  styles.input,
                  {
                    marginTop: 10,
                    color: colors.black,
                    fontFamily: fonts.medium,
                  },
                ]}
                placeholder={Strings.mobileNumber}
                keyboardType="phone-pad"
                value={Mobile}
                onChangeText={value => {
                  setMobile(value);
                  console.log('Selected Number >>>>', value);
                }}
              />

              <View style={{ marginTop: 10, alignSelf: 'flex-end' }}>
                <TouchableOpacity
                  activeOpacity={0.6}
                  style={styles.nextbtn}
                  //   onPress={() => {
                  //     // Final submission logic here
                  //     console.log('Final submission');
                  //     Alert.alert(
                  //       'Success',
                  //       'Your car details have been submitted successfully!',
                  //     );
                  //   }}
                  // >
                  onPress={() => {
                    if (validateSection(openIndex)) {
                      const jsonData = getFormDataAsJSON();
                      CoustomToast(
                        Strings.successTitle,
                        Strings.successTitle,
                        Strings.sussessSubmit,
                      );
                    }
                  }}
                >
                  <Text style={styles.text_Next}>{Strings.submit}</Text>
                  <Image
                    source={image.right}
                    style={{ height: 18, width: 18 }}
                    tintColor={colors.white}
                  />
                </TouchableOpacity>
              </View>
            </View>
          )}
        </SafeAreaView>
      </ScrollView>
    </View>
  );
};

export default Dashboard;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  headerContainer: {
    marginTop: Platform.OS === 'ios' ? 38 : 0,
    padding: 14,
    backgroundColor: '#fff',
    ...Platform.select({
      ios: {
        shadowColor: 'rgba(0,0,0,0.1)',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 1,
        shadowRadius: 4,
      },
      android: { elevation: 8 },
    }),
  },
  headerTitle: {
    textAlign: 'center',
    fontSize: 20,
    fontFamily: fonts.bold,
    color: colors.black,
  },
  accordionContainer: {
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    overflow: 'hidden',
  },
  accordionHeader: {
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  activeHeader: {
    backgroundColor: colors.lightgray,
  },
  accordionTitle: {
    fontSize: 16,
    fontFamily: fonts.bold,
  },
  accordionContent: {
    paddingHorizontal: 15,
    paddingBottom: 15,
    backgroundColor: colors.white,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
    fontFamily: fonts.light,
  },
  photoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 10,
  },
  photoItem: {
    width: 70,
    height: 70,
    margin: 3,
    borderRadius: 8,
    overflow: 'hidden',
    position: 'relative',
  },
  photoImage: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  removeBtn: {
    position: 'absolute',
    top: 2,
    right: 2,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 12,
    paddingHorizontal: 4,
  },
  addPhotoBox: {
    width: 70,
    height: 70,
    margin: 5,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addPhotoContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  addPhotoText: {
    fontSize: 12,
    color: colors.black,
    fontFamily: fonts.medium,
    textAlign: 'center',
  },
  dropdown: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 12,
    marginBottom: 15,
  },
  heading: {
    fontSize: 18,
    fontFamily: fonts.bold,
    textDecorationLine: 'underline',
    marginBottom: 20,
  },
  avatarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarImage: {
    width: 70,
    height: 70,
    borderRadius: 100,
  },
  nextbtn: {
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    padding: 7,
    borderRadius: 6,
  },
  text_Next: {
    fontFamily: fonts.semibold,
    color: colors.white,
    fontSize: 18,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  modalBtn: {
    padding: 15,
    backgroundColor: colors.primary,
    borderRadius: 10,
    marginVertical: 5,
    alignItems: 'center',
  },
  modalBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  downArrow: {
    height: 10,
    width: 10,
    marginRight: 5,
  },
});
