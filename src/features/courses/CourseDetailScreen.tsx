import React from 'react';
import { View, Text } from 'react-native';
import { useGetCourseByIdQuery } from '../../services/coursesApi';

const CourseDetailScreen = ({ route }: any) => {
  const { id } = route.params;
  const { data, isLoading } = useGetCourseByIdQuery(id);

  if (isLoading) return <Text>Loading...</Text>;
  if (!data) return <Text>Course not found</Text>;

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 22, fontWeight: 'bold' }}>
        {data.title}
      </Text>
      <Text style={{ marginTop: 10 }}>{data.description}</Text>
    </View>
  );
};

export default CourseDetailScreen;
