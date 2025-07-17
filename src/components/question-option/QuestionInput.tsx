import React from 'react';
import { View, TextInput, Text, Switch, Button } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { IQuestionOption } from '../../types/form/IQuestionOption';

const TYPES = {
  string: {},
  text: {},
  radio: { has_many_options: true },
  check: { has_many_options: true },
  select: { has_many_options: true },
  date: {},
  datetime: {},
  catalog: { is_catalog: true },
  neighbor: {},
  person_legal: {},
  person: {},
  address: {},
  geolocation: {},
  map: {},
  files: {},
  owner: { is_owner: true },
};

type Question = {
  type: keyof typeof TYPES;
  label: string;
  options?: IQuestionOption[]; // for radio, check, select
  value?: any;
  onChange: (value: any) => void;
  onPressFunction?:(value: any) => void;
};

export default function QuestionInput({ question }: { question: Question }) {
  const { type, label, options = [], value,onPressFunction, onChange } = question;

  // Render input based on type
  switch (type) {
    case 'string':
      return (
        <View>
          <Text>{label}</Text>
          <TextInput value={value} onChangeText={onChange} />
        </View>
      );

    case 'text':
      return (
        <View>
          <Text>{label}</Text>
          <TextInput
            multiline
            numberOfLines={4}
            value={value}
            onChangeText={onChange}
            style={{ height: 100, textAlignVertical: 'top' }}
          />
        </View>
      );

    case 'radio':
      return (
        <View>
          <Text>{label}</Text>
          {options.map((option) => (
            <View key={option.id} style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Switch
                value={value === option}
                onValueChange={() => onChange(option)}
              />
              <Text>{option.name}</Text>
            </View>
          ))}
          <Button
              title="Submit Answer"
              onPress={() => {
                if (onPressFunction) onPressFunction(value);
            }}
          />
        </View>
      );

    case 'check':
      return (
        <View>
          <Text>{label}</Text>
          {options.map((option) => (
            <View key={option.id} style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Switch
                value={Array.isArray(value) ? value.includes(option) : false}
                onValueChange={(isChecked) => {
                  if (!Array.isArray(value)) onChange([option]);
                  else {
                    if (isChecked) onChange([...value, option]);
                    else onChange(value.filter((v: string) => v !== option.name));
                  }
                }}
              />
              <Text>{option.name}</Text>
            </View>
          ))}
        </View>
      );

    case 'select':
      return (
        <View>
          <Text>{label}</Text>
          <Picker
            selectedValue={value}
            onValueChange={(itemValue) => onChange(itemValue)}
          >
            {options.map((option) => (
              <Picker.Item key={option} label={option} value={option} />
            ))}
          </Picker>
        </View>
      );

    case 'date':
      // For date, you can use DatePicker from a library, but here is a simple placeholder
      return (
        <View>
          <Text>{label}</Text>
          <Button title={value ? value.toString() : 'Select Date'} onPress={() => {/* show date picker */}} />
        </View>
      );

    // Add more types as needed...

    default:
      return (
        <View>
          <Text>{label}</Text>
          <Text>Unsupported input type: {type}</Text>
        </View>
      );
  }
}
