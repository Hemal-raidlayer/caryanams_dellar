import React, { useState } from 'react';
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
} from 'react-native';
import colors from '../../Utils/colors';
import fonts from '../../Utils/fonts';
import image from '../../Utils/images';
import { Dropdown } from 'react-native-element-dropdown';

// Enable LayoutAnimation on Android
if (Platform.OS === 'android') {
  UIManager.setLayoutAnimationEnabledExperimental &&
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

const Dashboard = () => {
  const [openIndex, setOpenIndex] = useState(null);

  // Dummy data for dropdowns
  const dummyOptions = [
    { label: 'Option 1', value: '1' },
    { label: 'Option 2', value: '2' },
  ];

  // Dummy photos
  const dummyPhotos = [
    'https://via.placeholder.com/150',
    'https://via.placeholder.com/160',
  ];

  // Accordion toggle
  const toggleAccordion = index => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setOpenIndex(openIndex === index ? null : index);
  };

  // Render uploaded photos (dummy)
  const renderPhotoBox = ({ item }) => (
    <View style={styles.photoItem}>
      <Image source={{ uri: item }} style={styles.photoImage} />
      <TouchableOpacity style={styles.removeBtn}>
        <Text style={{ color: '#fff', fontSize: 12 }}>X</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle={'dark-content'} backgroundColor={colors.white} />
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>Sell Car</Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{ paddingHorizontal: 12, marginTop: 12 }}
      >
        {/* Photos Section */}
        <View style={styles.accordionContainer}>
          <TouchableOpacity
            style={[
              styles.accordionHeader,
              openIndex === 0 && styles.activeHeader,
            ]}
            onPress={() => toggleAccordion(0)}
          >
            <Text style={styles.accordionTitle}>Upload Photos</Text>
            <Image
              source={openIndex === 0 ? image.down : image.up_arrow}
              style={{ height: 18, width: 18 }}
              resizeMode="contain"
            />
          </TouchableOpacity>
          {openIndex === 0 && (
            <View style={styles.accordionContent}>
              <FlatList
                data={dummyPhotos}
                keyExtractor={(item, index) => index.toString()}
                renderItem={renderPhotoBox}
                numColumns={4}
                ListFooterComponent={
                  <TouchableOpacity style={styles.addPhotoBox}>
                    <Image
                      source={image.camera_1}
                      style={{ height: 30, width: 30 }}
                      tintColor={colors.primary}
                    />
                    <Text style={styles.addPhotoText}>Add Photo</Text>
                  </TouchableOpacity>
                }
              />
              <View style={{ marginTop: 10, alignSelf: 'flex-end' }}>
                <TouchableOpacity activeOpacity={0.6} style={styles.nextbtn}>
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
        </View>

        {/* Details Section */}
        <View style={styles.accordionContainer}>
          <TouchableOpacity
            style={[
              styles.accordionHeader,
              openIndex === 1 && styles.activeHeader,
            ]}
            onPress={() => toggleAccordion(1)}
          >
            <Text style={styles.accordionTitle}>Details</Text>
            <Image
              source={openIndex === 1 ? image.down : image.up_arrow}
              style={{ height: 18, width: 18 }}
              resizeMode="contain"
            />
          </TouchableOpacity>
          {openIndex === 1 && (
            <View style={styles.accordionContent}>
              <Dropdown
                style={styles.dropdown}
                data={dummyOptions}
                labelField="label"
                valueField="value"
                placeholder="Select Brand"
              />
              <Dropdown
                style={styles.dropdown}
                data={dummyOptions}
                labelField="label"
                valueField="value"
                placeholder="Select Model"
              />
              <Dropdown
                style={styles.dropdown}
                data={dummyOptions}
                labelField="label"
                valueField="value"
                placeholder="Select Variant"
              />
              <Dropdown
                style={styles.dropdown}
                data={dummyOptions}
                labelField="label"
                valueField="value"
                placeholder="Select Year"
              />

              <TextInput style={styles.input} placeholder="KM Driven" />
              <TextInput style={styles.input} placeholder="Ad Title" />
              <TextInput
                style={[styles.input, { height: 80 }]}
                placeholder="Description"
                multiline
              />
              <TextInput style={styles.input} placeholder="Price" />

              <View style={{ marginTop: 10, alignSelf: 'flex-end' }}>
                <TouchableOpacity activeOpacity={0.6} style={styles.nextbtn}>
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
        </View>

        {/* Location Section */}
        <View style={styles.accordionContainer}>
          <TouchableOpacity
            style={[
              styles.accordionHeader,
              openIndex === 2 && styles.activeHeader,
            ]}
            onPress={() => toggleAccordion(2)}
          >
            <Text style={styles.accordionTitle}>Location</Text>
            <Image
              source={openIndex === 2 ? image.down : image.up_arrow}
              style={{ height: 18, width: 18 }}
              resizeMode="contain"
            />
          </TouchableOpacity>
          {openIndex === 2 && (
            <View style={styles.accordionContent}>
              <Dropdown
                style={styles.dropdown}
                data={dummyOptions}
                labelField="label"
                valueField="value"
                placeholder="Select State"
              />
              <Dropdown
                style={styles.dropdown}
                data={dummyOptions}
                labelField="label"
                valueField="value"
                placeholder="Select City"
              />

              <View style={{ marginTop: 10, alignSelf: 'flex-end' }}>
                <TouchableOpacity activeOpacity={0.6} style={styles.nextbtn}>
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
        </View>

        {/* Review Details Section */}
        <View style={styles.accordionContainer}>
          <TouchableOpacity
            style={[
              styles.accordionHeader,
              openIndex === 3 && styles.activeHeader,
            ]}
            onPress={() => toggleAccordion(3)}
          >
            <Text style={styles.accordionTitle}>Review Your Details</Text>
            <Image
              source={openIndex === 3 ? image.down : image.up_arrow}
              style={{ height: 18, width: 18 }}
              resizeMode="contain"
            />
          </TouchableOpacity>
          {openIndex === 3 && (
            <View style={styles.accordionContent}>
              <Text style={styles.heading}>Let's verify your account</Text>
              <View style={styles.avatarContainer}>
                <Image
                  source={image.profile2}
                  style={styles.avatarImage}
                  resizeMode="contain"
                />
                <TextInput
                  style={[styles.input, { flex: 1, marginLeft: 10 }]}
                  placeholder="Name"
                />
              </View>
              <TextInput
                style={[styles.input, { marginTop: 10 }]}
                placeholder="Mobile Phone Number"
                keyboardType="phone-pad"
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
        </View>
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
    padding: 15,
    backgroundColor: colors.white,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
    fontFamily: fonts.medium,
  },
  photoItem: {
    width: 70,
    height: 70,
    margin: 5,
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
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  addPhotoText: {
    fontSize: 12,
    color: colors.black,
    fontFamily: fonts.medium,
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
});
