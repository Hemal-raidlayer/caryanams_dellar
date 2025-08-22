import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
  Image,
  FlatList,
  StatusBar,
  Platform,
  UIManager,
  LayoutAnimation,
  Button,
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
import { BottomSheetScrollView } from '@gorhom/bottom-sheet';

// Enable LayoutAnimation on Android
// if (Platform.OS === 'android') {
//   UIManager.setLayoutAnimationEnabledExperimental &&
//     UIManager.setLayoutAnimationEnabledExperimental(true);
// }

const Dashboard = () => {

  // Details submit Api  Start
  const apiData = async ({}) => {
    try {
      const payload = {
        appName: 'app5347583724521',
        collectionToSubmit: 'usecar',
        sectionName: 'usecar',
        sectionData: {
          Brand: Brand?.value,
          Modal: CarModal?.value,
          Variant: Variant?.value,
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
      console.log({
        Brand,
        CarModal,
        Variant,
        Year,
        Fuel,
        Transmission,
        Owner,
        KmDrive,
        CarNumber,
        Insurance,
        insuranceStartDate,
        insuranceEndDate,
        ChassicNumber,
        lastServiceDate,
        Accidental,
        Key,
        Description,
      });
      return response;
    } catch (error) {
      console.log('API Error:', error);
      throw error;
    }
  };
// Details Submit Api  Over


// Detpails Field Api  Start
const Payload = {
  lookups: [
    {
      db: "caryanams",
      data: [
        {
          table: "newbrand",
          query: {},
          projection: {
            _id: 0,
            brandId: "$_id",
            brandname: "$sectionData.newBrand.brandname",
            url: "$sectionData.newBrand.url",
            modelCount: "$sectionData.newBrand.modelCount"
          },
          label: "BrandList",
          type: "array",
          lookup: []
        },
        {
          table: "model",
          query: {},
          projection: {
            _id: 0,
            modelId: "$_id",
            name: "$sectionData.model.name",
            companyId: "$sectionData.model.companyId"
          },
          label: "modelList",
          type: "array",
          lookup: []
        },
        {
          table: "variant",
          query: {},
          projection: {
            _id: 0,
            variantId: "$_id",
            variantname: "$sectionData.variant.name",
            model: "$sectionData.variant.model",
            modelname: { $arrayElemAt: ["$modelDetails.sectionData.model.name", 0] },
            brandid: "$sectionData.variant.brandname"
          },
          label: "variantList",
          type: "array",
          lookup: [
            {
              from: "model",
              localField: "sectionData.variant.model",
              foreignField: "_id",
              as: "modelDetails"
            }
          ]
        }
      ]
    }
  ]
};


// 1️⃣ Fetch Brands
const brandsPayload = {
  lookups: [
    {
      db: "caryanams",
      data: [
        {
          table: "newbrand",
          query: {}, // fetch all brands
          projection: {
            _id: 0,
            brandId: "$_id",
            brandname: "$sectionData.newBrand.brandname"
          },
          label: "BrandList",
          type: "array",
          lookup: []
        }
      ]
    }
  ]
};

// 2️⃣ Fetch Models by brand
const modelsPayload = (brandId) => ({
  lookups: [
    {
      db: "caryanams",
      data: [
        {
          table: "model",
          query: { "sectionData.model.companyId": brandId }, // filter by brand
          projection: {
            _id: 0,
            modelId: "$_id",
            name: "$sectionData.model.name"
          },
          label: "modelList",
          type: "array",
          lookup: []
        }
      ]
    }
  ]
});

// 3️⃣ Fetch Variants by model
const variantsPayload = (modelId) => ({
  lookups: [
    {
      db: "caryanams",
      data: [
        {
          table: "variant",
          query: { "sectionData.variant.model": modelId }, // filter by model
          projection: {
            _id: 0,
            variantId: "$_id",
            variantname: "$sectionData.variant.name"
          },
          label: "variantList",
          type: "array",
          lookup: []
        }
      ]
    }
  ]
});


// Fetch all brands
const fetchBrands = async () => {
  try {
    const response = await api.post('v2/dynamic/process', brandsPayload);
    console.log('Brands Response:', response); 
    // adjust path depending on API response
    setBrands(response.BrandList || response.lookups?.[0]?.data?.[0]?.BrandList || []);
  } catch (err) {
    console.error(err);
  }
};

// Fetch models by selected brand
const fetchModels = async (brandId) => {
  try {
    const response = await api.post('v2/dynamic/process', modelsPayload(brandId));
    console.log('Models Response:', response); 
    setModels(response.modelList || response.lookups?.[0]?.data?.[0]?.modelList || []);
  } catch (err) {
    console.error(err);
  }
};

// Fetch variants by selected model
const fetchVariants = async (modelId) => {
  try {
    const response = await api.post('v2/dynamic/process', variantsPayload(modelId));
    console.log('Variants Response:', response); 
    setVariants(response.variantList || response.lookups?.[0]?.data?.[0]?.variantList || []);
  } catch (err) {
    console.error(err);
  }
};


useEffect(() => {
  // fetchBrands();  
}, []);






  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const data = await api.post('v2/dynamic/process', Payload);
  //       console.log('Fetched data:', data);
  //     } catch (err) {
  //       console.error(err);
  //     }
  //   };

  //   fetchData();
  // }, []);

// Details Field Api  Over



  // Fetch And Log Token
  const [Token, setToken] = useState(null);

  const printToken = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (token) {
        console.log('Fetched token:', token);
        setToken(token);
      } else {
        console.log('No token found');
      }
    } catch (error) {
      console.log('Error fetching token:', error);
    }
  };
  useEffect(() => {
    printToken();
  }, []);

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
  
  const [brands, setBrands] = useState([]);
const [models, setModels] = useState([]);
const [variants, setVariants] = useState([]);

  // date Formate
  const formatDate = date => {
    if (!date) return '';
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0'); // months are 0-indexed
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Dummy data for dropdowns
  const dummyOptions = [
    { label: 'Option 1', value: '1' },
    { label: 'Option 2', value: '2' },
  ];

  // Dummy data for transmission
  const transmissionOptions = [
    { label: 'Manual', value: 'manual' },
    { label: 'Automatic', value: 'automatic' },
  ];

  // Dummy data for fuels
  const fuels = [
    { label: 'CNG & Hybrids', value: 'cng' },
    { label: 'Diesel', value: 'diesel' },
    { label: 'Electric', value: 'electric' },
    { label: 'LPG', value: 'lpg' },
    { label: 'Petrol', value: 'petrol' },
  ];

  // Dummy data for Owner
  const OwnerList = [
    { label: '1st', value: '1st' },
    { label: '2nd', value: '2nd' },
    { label: '3rd', value: '3rd' },
    { label: '4th', value: '4th' },
    { label: '4+', value: '4+' },
  ];

  // Dummy data for Insurance
  const InsuranceList = [
    { label: 'Yes', value: 'yes' },
    { label: 'No', value: 'no' },
  ];

  // Dummy data for Key
  const KeyList = [
    { label: 'Yes', value: 'yes' },
    { label: 'No', value: 'no' },
  ];

  


  const renderPhotoBox = ({ item }) => (
    <View style={styles.photoItem}>
      <Image source={{ uri: item.uri }} style={styles.photoImage} />
      <TouchableOpacity
        style={styles.removeBtn}
        onPress={() => {
          // Remove photo on press
          setDummyPhotos(prev => prev.filter(photo => photo.id !== item.id));
          setsetAllPhotod(prev => prev.filter(photo => photo.id !== item.id));
        }}
      >
        <Text style={{ color: '#fff', fontSize: 12 }}>X</Text>
      </TouchableOpacity>
    </View>
  );
  // const handleNext = () => {
  //   const validation = validateStep(openIndex);

  //   if (!validation.valid) {
  //     Alert.alert('Error', validation.message);
  //     return;
  //   }

  //   if (openIndex < 4) {
  //     setOpenIndex(openIndex + 1);
  //   }
  // };

  // const [isStepValid, setIsStepValid] = useState({
  //   0: false, // Front Photo
  //   1: false, // All Photos
  //   2: false, // Details
  //   3: false, // Location
  //   4: false, // Review
  // });

  const validateStep = step => {
    switch (step) {
      case 0: // Front Photo
        if (AllPhotod.length === 0) {
          return {
            valid: false,
            message: 'Please add at least one front photo.',
          };
        }
        return { valid: true };

      case 1: // All Photos
        if (dummyPhotos.length === 0) {
          return {
            valid: false,
            message: 'Please add at least one photo in All Photos.',
          };
        }
        return { valid: true };

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
          return {
            valid: false,
            message: 'Please fill all mandatory fields in Details.',
          };
        }
        return { valid: true };

      case 3: // Location
        if (!State || !City || !Area || !Rto) {
          return {
            valid: false,
            message: 'Please fill all mandatory fields in Location.',
          };
        }
        return { valid: true };

      case 4: // Review
        if (!Name || !Mobile) {
          return {
            valid: false,
            message: 'Please fill all mandatory fields in Review section.',
          };
        }
        return { valid: true };

      default:
        return { valid: true };
    }
  };
  const toggleAccordion = index => {
    if (openIndex !== null && openIndex !== index) {
          }

    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle={'dark-content'} backgroundColor={colors.white} />
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>Sell Car</Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled={true}
        keyboardShouldPersistTaps="handled"
        style={{ paddingHorizontal: 12, marginTop: 12 }}
      >
        {/* font photo section */}
        <SafeAreaView style={styles.accordionContainer}>
          <TouchableOpacity
            style={[
              styles.accordionHeader,
              openIndex === 0 && styles.activeHeader,
            ]}
            onPress={() => toggleAccordion(0)}
          >
            <Text style={styles.accordionTitle}>Front Photo</Text>
            <Image
              source={openIndex === 0 ? image.down : image.up_arrow}
              style={{ height: 18, width: 18 }}
              resizeMode="contain"
            />
          </TouchableOpacity>

          {openIndex === 0 && (
            <View style={styles.accordionContent}>
              <FlatList
                data={AllPhotod}
                keyExtractor={(item, index) => index.toString()}
                renderItem={renderPhotoBox}
                numColumns={4}
                scrollEnabled={false}
                nestedScrollEnabled={true}
                ListFooterComponent={
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
                      <Text style={styles.addPhotoText}>Add Photo</Text>
                    </View>
                  </TouchableOpacity>
                }
              />

              {/* Bottom Sheet for Camera / Gallery */}
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
                    <Text style={styles.modalTitle}>Choose Option</Text>

                    {/* Camera Option */}
                    <TouchableOpacity
                      style={styles.modalBtn}
                      onPress={async () => {
                        try {
                          const granted = await PermissionsAndroid.request(
                            PermissionsAndroid.PERMISSIONS.CAMERA,
                            {
                              title: 'Camera Permission',
                              message: 'App needs access to your camera',
                              buttonPositive: 'OK',
                            },
                          );
                          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                            const image = await ImagePicker.openCamera({
                              width: 300,
                              height: 300,
                              cropping: false,
                              mediaType: 'photo', // only photo
                            });
                            const newPhoto = {
                              id: Date.now().toString(),
                              uri: image.path,
                            };
                            setsetAllPhotod([...AllPhotod, newPhoto]);
                            setShowFrontPicker(false);
                          }
                        } catch (error) {
                          console.log('Camera error:', error);
                        }
                      }}
                    >
                      <Text style={styles.modalBtnText}>📷 Camera</Text>
                    </TouchableOpacity>

                    {/* Gallery Option */}
                    <TouchableOpacity
                      style={styles.modalBtn}
                      onPress={async () => {
                        try {
                          const granted = await PermissionsAndroid.request(
                            PermissionsAndroid.PERMISSIONS
                              .READ_EXTERNAL_STORAGE,
                            {
                              title: 'Storage Permission',
                              message: 'App needs access to your gallery',
                              buttonPositive: 'OK',
                            },
                          );
                          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                            const image = await ImagePicker.openPicker({
                              width: 300,
                              height: 300,
                              cropping: false,
                              mediaType: 'photo', // ✅ only photo
                            });
                            const newPhoto = {
                              id: Date.now().toString(),
                              uri: image.path,
                            };
                            setsetAllPhotod([...AllPhotod, newPhoto]);
                            setShowFrontPicker(false);
                          }
                        } catch (error) {
                          console.log('Gallery error:', error);
                        }
                      }}
                    >
                      <Text style={styles.modalBtnText}>🖼️ Gallery</Text>
                    </TouchableOpacity>

                    {/* Cancel */}
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

              {/* Next Button */}
              <View style={{ marginTop: 10, alignSelf: 'flex-end' }}>
                <TouchableOpacity
                  activeOpacity={0.6}
                  style={styles.nextbtn}
                  // onPress={handleNext}
                >
                  <Text style={styles.text_Next}>Next</Text>
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
        {/*  Front Photo Section Over */}

        {/* Photos Section */}
        <SafeAreaView style={styles.accordionContainer}>
          <TouchableOpacity
            style={[
              styles.accordionHeader,
              openIndex === 1 && styles.activeHeader,
            ]}
            onPress={() => toggleAccordion(1)}
          >
            <Text style={styles.accordionTitle}>All Photos</Text>
            <Image
              source={openIndex === 1 ? image.down : image.up_arrow}
              style={{ height: 18, width: 18 }}
              resizeMode="contain"
            />
          </TouchableOpacity>

          {openIndex === 1 && (
            <View style={styles.accordionContent}>
              <FlatList
                data={dummyPhotos}
                keyExtractor={(item, index) => index.toString()}
                renderItem={renderPhotoBox}
                numColumns={4}
                scrollEnabled={false}
                nestedScrollEnabled={true}
                ListFooterComponent={
                  <TouchableOpacity
                    style={styles.addPhotoBox}
                    onPress={() => setShowPicker(true)} // open bottom sheet
                  >
                    <Image
                      source={image.camera_1}
                      style={{ height: 30, width: 30 }}
                      tintColor={colors.primary}
                    />
                    <Text style={styles.addPhotoText}>Add Photo</Text>
                  </TouchableOpacity>
                }
              />

              {/* Bottom Sheet for Camera / Gallery */}
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
                    <Text style={styles.modalTitle}>Choose Option</Text>

                    {/* Camera Option */}
                    <TouchableOpacity
                      style={styles.modalBtn}
                      onPress={async () => {
                        try {
                          const granted = await PermissionsAndroid.request(
                            PermissionsAndroid.PERMISSIONS.CAMERA,
                            {
                              title: 'Camera Permission',
                              message: 'App needs access to your camera',
                              buttonPositive: 'OK',
                            },
                          );
                          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                            const image = await ImagePicker.openCamera({
                              width: 300,
                              height: 300,
                              cropping: false,
                              mediaType: 'photo', // ✅ only photo
                            });
                            const newPhoto = {
                              id: Date.now().toString(),
                              uri: image.path,
                            };
                            setDummyPhotos([...dummyPhotos, newPhoto]);
                            setShowPicker(false);
                          }
                        } catch (error) {
                          console.log('Camera error:', error);
                        }
                      }}
                    >
                      <Text style={styles.modalBtnText}>📷 Camera</Text>
                    </TouchableOpacity>

                    {/* Gallery Option */}
                    <TouchableOpacity
                      style={styles.modalBtn}
                      onPress={async () => {
                        try {
                          const granted = await PermissionsAndroid.request(
                            PermissionsAndroid.PERMISSIONS
                              .READ_EXTERNAL_STORAGE,
                            {
                              title: 'Storage Permission',
                              message: 'App needs access to your gallery',
                              buttonPositive: 'OK',
                            },
                          );
                          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                            const image = await ImagePicker.openPicker({
                              width: 300,
                              height: 300,
                              cropping: false,
                              mediaType: 'photo', // ✅ only photo
                            });
                            const newPhoto = {
                              id: Date.now().toString(),
                              uri: image.path,
                            };
                            setDummyPhotos([...dummyPhotos, newPhoto]);
                            setShowPicker(false);
                          }
                        } catch (error) {
                          console.log('Gallery error:', error);
                        }
                      }}
                    >
                      <Text style={styles.modalBtnText}>🖼️ Gallery</Text>
                    </TouchableOpacity>

                    {/* Cancel */}
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

              {/* Next Button */}
              <View style={{ marginTop: 10, alignSelf: 'flex-end' }}>
                <TouchableOpacity
                  activeOpacity={0.6}
                  style={styles.nextbtn}
                  // onPress={handleNext}
                >
                  <Text style={styles.text_Next}>Next</Text>
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
        {/*  Photo Section Over */}

        {/* Details Section */}
        <SafeAreaView style={styles.accordionContainer}>
          <TouchableOpacity
            style={[
              styles.accordionHeader,
              openIndex === 2 && styles.activeHeader,
            ]}
            onPress={() => toggleAccordion(2)}
          >
            <Text style={styles.accordionTitle}>Details</Text>
            <Image
              source={openIndex === 2 ? image.down : image.up_arrow}
              style={{ height: 18, width: 18 }}
              resizeMode="contain"
            />
          </TouchableOpacity>
          {openIndex === 2 && (
            <View style={styles.accordionContent}>
              {/* <View>
                <Text style={{ color: 'red' }}>*</Text>
                <Dropdown
                  style={styles.dropdown}
                  data={dummyOptions}
                  labelField="label"
                  valueField="value"
                  placeholder="Select Brand"
                  value={Brand}
                  onChange={value => {
                    setBrand(value);
                    console.log('Selected Brand', value);
                  }}
                />
              </View> */}
              <View>
                <Text style={{ color: 'red' }}>*</Text>
                 <Dropdown
          style={styles.dropdown}
          data={brands} // ✅ Changed from dummyOptions
          labelField="brandname" // ✅ brand label
          valueField="brandId" // ✅ brand value
          placeholder="Select Brand"
          value={Brand}
          onChange={async (value) => {
            setBrand(value);
            setCarModal(''); // reset model
            setVariant(''); // reset variant
            console.log('Selected Brand', value);

            // ✅ Fetch models for selected brand
            try {
              const response = await api.post('v2/dynamic/process', modelsPayload(value));
              setModels(response.modelList || []);
            } catch (err) {
              console.error(err);
            }
          }}
        />
      </View>

      {/* ---------- MODEL Dropdown ---------- */}
      <View>
        <Text style={{ color: 'red' }}>*</Text>
        <Dropdown
          style={styles.dropdown}
          data={models} // ✅ Changed from dummyOptions
          labelField="name"
          valueField="modelId"
          placeholder="Select Model"
          value={CarModal}
          onChange={async (value) => {
            setCarModal(value);
            setVariant(''); // reset variant
            console.log('Selected Car model', value);

            // ✅ Fetch variants for selected model
            try {
              const response = await api.post('v2/dynamic/process', variantsPayload(value));
              setVariants(response.variantList || []);
            } catch (err) {
              console.error(err);
            }
          }}
          disabled={!Brand} // ✅ Disabled if no brand selected
        />
      </View>

      {/* ---------- VARIANT Dropdown ---------- */}
      <View>
        <Text style={{ color: 'red' }}>*</Text>
        <Dropdown
          style={styles.dropdown}
          data={variants} // ✅ Changed from dummyOptions
          labelField="variantname"
          valueField="variantId"
          placeholder="Select Variant"
          value={Variant}
          onChange={(value) => {
            setVariant(value);
            console.log('Selected Variant', value);
          }}
          disabled={!CarModal} // ✅ Disabled if no model selected
        />
      </View>
                {/* <Dropdown
                  style={styles.dropdown}
                  data={dummyOptions}
                  labelField="label"
                  valueField="value"
                  placeholder="Select Model"
                  value={CarModal}
                  onChange={value => {
                    setCarModal(value);
                    console.log('Selected Car model', value);
                  }}
                />
              </View>
              <View>
                <Text style={{ color: 'red' }}>*</Text>
                <Dropdown
                  style={styles.dropdown}
                  data={dummyOptions}
                  labelField="label"
                  valueField="value"
                  placeholder="Select Variant"
                  value={Variant}
                  onChange={value => {
                    setVariant(value);
                    console.log('Selected Variant', value);
                  }}
                />
              </View> */}

              <View>
                <Text style={{ color: 'red' }}>*</Text>
                <Dropdown
                  style={styles.dropdown}
                  data={dummyOptions}
                  labelField="label"
                  valueField="value"
                  placeholder="Select Year"
                  value={Year}
                  onChange={value => {
                    setYear(value);
                    console.log('Selected Year', value);
                  }}
                />
              </View>

              {/* Fuel */}
              <View>
                <Text style={{ color: 'red' }}>*</Text>
                <OptionSelector
                  title="Fuel"
                  options={fuels}
                  multiSelect={false}
                  onSelect={value => {
                    setFuel(value);
                    console.log('Selected Fuel:', value);
                  }}
                />
              </View>

              <View>
                <Text style={{ color: 'red' }}>*</Text>
                <OptionSelector
                  title="Transmission"
                  options={transmissionOptions}
                  multiSelect={false}
                  onSelect={value => {
                    setTransmission(value);
                    console.log('Selected Transmission:', value);
                  }}
                />
              </View>

              <View>
                <Text style={{ color: 'red' }}>*</Text>
                <OptionSelector
                  title="No. Of Owner"
                  options={OwnerList}
                  multiSelect={false}
                  onSelect={value => {
                    setOwner(value);
                    console.log('Selected No Of Owner:', value);
                  }}
                />
              </View>

              <View>
                <Text style={{ color: 'red' }}>*</Text>
                <TextInput
                  style={[
                    styles.input,
                    { color: colors.black, fontFamily: fonts.medium },
                  ]}
                  placeholder="KM Driven"
                  placeholderTextColor={colors.darkgray}
                  value={KmDrive}
                  onChangeText={value => {
                    setKmDrive(value);
                    console.log('Selected Km Driven', value);
                  }}
                />
              </View>

              <View>
                <Text style={{ color: 'red' }}>*</Text>
                <TextInput
                  style={[
                    styles.input,
                    { color: colors.black, fontFamily: fonts.medium },
                  ]}
                  placeholder="Car Number"
                  placeholderTextColor={colors.darkgray}
                  value={CarNumber}
                  onChangeText={value => {
                    setCarNumber(value);
                    console.log('Selected Car Number', value);
                  }}
                />
              </View>

              <OptionSelector
                title="Insurance"
                options={InsuranceList}
                multiSelect={false}
                onSelect={value => {
                  setInsurance(value);
                  console.log('Selected Insurance:', value);
                }}
              />

              {/* Insurance start Date */}
              <View
                style={{
                  marginTop: 10,
                  width: '100%',
                  justifyContent: 'space-between',
                }}
              >
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
                      : 'Select Insurance Start Date'}
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
                    'Selected Insurance Start Date:',
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
                      : 'Select Insurance End Date'}
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
                    'Selected Insurance End Date:',
                    selectedDate.toDateString(),
                  ); // ✅ log date
                }}
                onCancel={() => setOpenEnd(false)}
              />

              <TextInput
                style={[
                  styles.input,
                  { color: colors.black, fontFamily: fonts.medium },
                ]}
                placeholder="Chassis Number"
                placeholderTextColor={colors.darkgray}
                value={ChassicNumber}
                onChangeText={value => {
                  setChassicNumber(value);
                  console.log('Selected Chassis Number', value);
                }}
              />

              {/*  Last Service Date */}
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
                      : 'Select Last Service Date'}
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
                  ); // ✅ log date
                }}
                onCancel={() => setOpenService(false)}
              />

              <Dropdown
                style={styles.dropdown}
                data={dummyOptions}
                labelField="label"
                valueField="value"
                placeholder="Accidental"
                value={Accidental}
                onChange={value => {
                  setAccidental(value);
                  console.log('selected Accidental Data', value);
                }}
              />

              <OptionSelector
                title="Dublicate Key"
                options={KeyList}
                multiSelect={false}
                onSelect={value => {
                  setKey(value);
                  console.log('Selected Dublicate Key:', value);
                }}
              />

              <View style={{ marginBottom: 5 }}>
                <Text style={{ color: 'red' }}>*</Text>

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
                  placeholder="Description"
                  placeholderTextColor={colors.darkgray}
                  value={Description}
                  onChangeText={value => {
                    setDescription(value);
                    console.log('Description >>', value);
                  }}
                />
              </View>

              <View style={{ marginTop: 10, alignSelf: 'flex-end' }}>
                <TouchableOpacity
                  activeOpacity={0.6}
                  style={styles.nextbtn}
                  // onPress={handleSubmit}
                  onPress={apiData}
                >
                  <Text style={styles.text_Next}>Next</Text>
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
        {/* Details Section Over */}

        {/* Location Section */}
        <SafeAreaView style={styles.accordionContainer}>
          <TouchableOpacity
            style={[
              styles.accordionHeader,
              openIndex === 3 && styles.activeHeader,
            ]}
            onPress={() => toggleAccordion(3)}
          >
            <Text style={styles.accordionTitle}>Location</Text>
            <Image
              source={openIndex === 3 ? image.down : image.up_arrow}
              style={{ height: 18, width: 18 }}
              resizeMode="contain"
            />
          </TouchableOpacity>
          {openIndex === 3 && (
            <View style={styles.accordionContent}>
              <Dropdown
                style={styles.dropdown}
                data={dummyOptions}
                labelField="label"
                valueField="value"
                placeholder="Select State"
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
                placeholder="Select City"
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
                placeholder="Select Rto"
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
                  // onPress={handleNext}
                >
                  <Text style={styles.text_Next}>Next</Text>
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
        {/* Location Section Over */}

        {/* Review Details Section */}
        <SafeAreaView style={styles.accordionContainer}>
          <TouchableOpacity
            style={[
              styles.accordionHeader,
              openIndex === 4 && styles.activeHeader,
            ]}
            onPress={() => toggleAccordion(4)}
          >
            <Text style={styles.accordionTitle}>Review Your Details</Text>
            <Image
              source={openIndex === 4 ? image.down : image.up_arrow}
              style={{ height: 18, width: 18 }}
              resizeMode="contain"
            />
          </TouchableOpacity>
          {openIndex === 4 && (
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
                  placeholder="Name"
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
                placeholder="Mobile Phone Number"
                keyboardType="phone-pad"
                value={Mobile}
                onChangeText={value => {
                  setMobile(value);
                  console.log('Selected Number >>>>', value);
                }}
              />

              <View style={{ marginTop: 10, alignSelf: 'flex-end' }}>
                <TouchableOpacity activeOpacity={0.6} style={styles.nextbtn}>
                  <Text style={styles.text_Next}>Submit</Text>
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
        {/* Review Details Section over */}
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
    // padding: 15,
    paddingHorizontal: 15,
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
    alignItems: 'center', // centers the child view
  },
  addPhotoContent: {
    justifyContent: 'center',
    alignItems: 'center', // centers Image and Text inside
  },
  addPhotoText: {
    fontSize: 12,
    color: colors.black,
    fontFamily: fonts.medium,
    textAlign: 'center', // ensures text is centered horizontally
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

  title: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 10,
    textDecorationLine: 'underline',
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 2,
  },
  option: {
    borderWidth: 1.5,
    borderColor: '#6A5AE0',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 10,
    margin: 5,
  },
  optionText: {
    color: '#6A5AE0',
    fontSize: 14,
  },
  selectedOption: {
    backgroundColor: '#6A5AE0',
  },
  selectedText: {
    color: '#fff',
  },
  disabledOption: {
    borderColor: '#ccc',
    backgroundColor: '#f2f2f2',
  },
  disabledText: {
    color: '#ccc',
  },
  downArrow: {
    height: 10,
    width: 10,
    marginRight: 5,
  },
});
