import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from "react-native";

const OptionSelector = ({ title, options, multiSelect = false, onSelect }) => {
  const [selected, setSelected] = useState(multiSelect ? [] : null);

  const handleSelect = (value) => {
    if (multiSelect) {
      let updated;
      if (selected.includes(value)) {
        updated = selected.filter((item) => item !== value);
      } else {
        updated = [...selected, value];
      }
      setSelected(updated);
      onSelect && onSelect(updated);
    } else {
      setSelected(value);
      onSelect && onSelect(value);
    }
  };

  const renderItem = ({ item }) => {
    const isSelected = multiSelect
      ? selected.includes(item.value)
      : selected === item.value;

    return (
      <TouchableOpacity
        disabled={item.disabled}
        style={[
          styles.option,
          item.disabled && styles.disabledOption,
          isSelected && styles.selectedOption,
        ]}
        onPress={() => handleSelect(item.value)}
      >
        <Text
          style={[
            styles.optionText,
            item.disabled && styles.disabledText,
            isSelected && styles.selectedText,
          ]}
        >
          {item.label}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {title && <Text style={styles.title}>{title}</Text>}
      <FlatList
        data={options}
        renderItem={renderItem}
        keyExtractor={(item) => item.value}
        numColumns={2}
        columnWrapperStyle={{ gap: 10 }}
        contentContainerStyle={{ gap: 10 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    bottom:10,
    marginBottom:10

    
  },
  title: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 10,
    textDecorationLine: "underline",
  },
  option: {
    borderWidth: 1.5,
    borderColor: "#6A5AE0",
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 5,
    flex: 1,
    alignItems: "center",
    justifyContent: "center",

  },
  optionText: {
    color: "#6A5AE0",
    fontSize: 14,
  },
  selectedOption: {
    backgroundColor: "#6A5AE0",
  },
  selectedText: {
    color: "#fff",
  },
  disabledOption: {
    borderColor: "#ccc",
    backgroundColor: "#f2f2f2",
  },
  disabledText: {
    color: "#ccc",
  },
});

export default OptionSelector;
