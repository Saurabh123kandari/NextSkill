import React from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  Button,
} from 'react-native';
import { useGetCoursesQuery } from '../../services/coursesApi';

// Redux imports
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import { setUserName } from '../../store/slices/userSlice';

const CoursesScreen = ({ navigation }: any) => {
  const { data, isLoading, error } = useGetCoursesQuery();

  // Redux local state usage
  const name = useSelector((state: RootState) => state.user.name);
  const dispatch = useDispatch();

  if (isLoading) return <ActivityIndicator size="large" color="blue" />;
  if (error) return <Text>Error loading courses</Text>;

  return (
    <View style={{ flex: 1, padding: 10 }}>
      {/* Redux Example */}
      <Button
        title="Set Name"
        onPress={() => dispatch(setUserName('Saurabh'))}
      />
      <Text style={{ fontSize: 16, marginVertical: 5 }}>
        User Name: {name ?? 'Not set'}
      </Text>

      {/* API Example */}
      <FlatList
        data={data}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View
            style={{ padding: 10, borderBottomWidth: 1 }}
          >
            <Text
              style={{ fontSize: 18 }}
              onPress={() =>
                navigation.navigate('CourseDetail', { id: item.id })
              }
            >
              {item.title}
            </Text>
            <Text>{item.description}</Text>
          </View>
        )}
      />
    </View>
  );
};

export default CoursesScreen;
