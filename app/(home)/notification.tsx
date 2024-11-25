import { View, FlatList, RefreshControl } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useUserStore } from '@/service/userStore';
import NotificationItem from '@/components/search/NotificationItem';
import { getAllFriendRequests, onHandleRequest } from '@/service/api/userService';
import { getAllConversations } from '@/service/api/chatService';
import { searchStyles } from '@/styles/searchStyles';
import SearchBar from '@/components/search/SearchBar';

const Page = () => {

  const { requests } = useUserStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const renderUsers = ({ item }: any) => {
    return (
      <NotificationItem
        onAcceptRequest={async () => {
          await onHandleRequest(item?._id, 'ACCEPT')
          getAllFriendRequests()
          getAllConversations()
        }}
        onRejectRequest={async () => {
          await onHandleRequest(item?._id, 'REJECT')
          getAllFriendRequests()
          getAllConversations()
        }}
        item={item}
      />
    )
  }

  useEffect(() => {
    getAllFriendRequests()
  }, [])

  const refreshHandler = async () => {
    setIsRefreshing(true);
    await getAllFriendRequests();
    setIsRefreshing(false);
  }

  return (
    <View style={searchStyles.container}>
      <SearchBar title='Notification' searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

      <FlatList
        data={requests}
        refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={refreshHandler} />}
        renderItem={renderUsers}
        keyExtractor={(item: any) => item.id}
        initialNumToRender={5}
        contentContainerStyle={searchStyles.scrollContainer}
      />

    </View>
  )
}

export default Page