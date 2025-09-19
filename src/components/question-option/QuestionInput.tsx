import React from 'react';
import { View, TextInput, Text, Switch, Button } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { IQuestionOption } from '../../types/form/IQuestionOption';
import pickMedia from '../../utlis/ImagePickerService';
import { fetchLocation } from '../../utlis/getLocatiom';

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
  options?: IQuestionOption[];
  value?: any;
  onChange: (value: any) => void;
  onPressFunction?:(value: any) => void;
};

export default function QuestionInput({ question }: { question: Question }) {
  const { type, label, options = [], value, onPressFunction, onChange } = question;

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
                value={value === option.name}
                onValueChange={() => {
                  onChange(option.name);
                  onPressFunction && onPressFunction(option.panel_id);
                }}
              />
              <Text>{option.name}</Text>
            </View>
          ))}
        </View>
      );

    case 'check':
      return (
        <View>
          <Text>{label}</Text>
          {options.map((option) => (
            <View key={option.id} style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Switch
                value={Array.isArray(value) ? value.includes(option.name) : false}
                onValueChange={(isChecked) => {
                  if (!Array.isArray(value)) {
                    onChange([option.name]);
                  } else {
                    if (isChecked) onChange([...value, option.name]);
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
          <Picker selectedValue={value} onValueChange={(itemValue) => onChange(itemValue)}>
            {options.map((option) => (
              <Picker.Item key={option.id} label={option.name} value={option.name} />
            ))}
          </Picker>
        </View>
      );

    case 'date':
      return (
        <View>
          <Text>{label}</Text>
          <Button
            title={value ? value.toString() : 'Seleccionar fecha'}
            onPress={() => {
              // implementar date picker
            }}
          />
        </View>
      );

  case 'files':
    return (
      <View>
        <Text>{label}</Text>
        <Button
          title="Subir archivo"
          onPress={async () => {
            const asset = await pickMedia('gallery', 'photo'); // or 'camera'
            if (asset) {
              const newFiles = Array.isArray(value?.files)
                ? [...value.files, asset]
                : [asset];
              onChange({ files: newFiles }); // ✅ always wrap in { files: [...] }
            }
          }}
        />
        {value?.files && value.files.length > 0 && (
          <Text>Archivos seleccionados: {value.files.length}</Text>
        )}
      </View>
    );
    
    case 'geolocation':
      return (
        <View>
          <Text>{label}</Text>
          <Button
            title="Obtener ubicación"
            onPress={async () => {
              await fetchLocation(value, (loc) => onChange(loc)); // loc = { latitude, longitude }
            }}
          />
          {value?.latitude && value?.longitude && (
            <View>
              <Text>Lat: {value.latitude}</Text>
              <Text>Lng: {value.longitude}</Text>
            </View>
          )}
        </View>
    );


    default:
      return (
        <View>
          <Text>{label}</Text>
          <Text>Unsupported input type: {type}</Text>
        </View>
      );
  }
}