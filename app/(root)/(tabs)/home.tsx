import { useUser } from "@clerk/clerk-expo";
import { useAuth } from "@clerk/clerk-expo";
import * as Location from "expo-location";
import { router } from "expo-router";
import { useState, useEffect, useRef } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Searchbar } from 'react-native-paper';
import BottomSheet from '@gorhom/bottom-sheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import Map from "@/components/Map";
import ProductBottomSheet from "@/components/ProductBottomSheet";
import { icons } from "@/constants";
import { colors } from "@/constants";
import { useLocationStore } from "@/store";
import { fetchProducts, fetchStores, searchProducts, Product, Store } from "@/lib/supabase";

const Home = () => {
  const { user } = useUser();
  const { signOut } = useAuth();

  const { setUserLocation } = useLocationStore();
  const bottomSheetRef = useRef<BottomSheet>(null);

  const [hasPermission, setHasPermission] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);
  const [userCoords, setUserCoords] = useState<{ latitude: number; longitude: number } | null>(null);
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);

  const handleSignOut = () => {
    signOut();
    router.replace("/(auth)/sign-in");
  };

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setHasPermission(false);
        return;
      }

      let location = await Location.getCurrentPositionAsync({});

      const address = await Location.reverseGeocodeAsync({
        latitude: location.coords?.latitude!,
        longitude: location.coords?.longitude!,
      });

      const coords = {
        latitude: location.coords?.latitude,
        longitude: location.coords?.longitude,
      };

      setUserCoords(coords);

      setUserLocation({
        ...coords,
        address: `${address[0].name}, ${address[0].region}`,
      });

      setHasPermission(true);
    })();
  }, []);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const [productsData, storesData] = await Promise.all([
      fetchProducts(),
      fetchStores(),
    ]);
    setProducts(productsData);
    setStores(storesData);
    setLoading(false);
  };

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (query.trim() === '') {
      const productsData = await fetchProducts();
      setProducts(productsData);
    } else {
      const results = await searchProducts(query);
      setProducts(results);
    }
  };

  const handleProductPress = (product: Product) => {
    if (product.store) {
      setSelectedStore(product.store);
    }
  };

  if (Platform.OS === 'web') {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.softWhite }}>
        <View style={{ flex: 1, padding: 20, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ fontSize: 24, fontWeight: '700', color: colors.deepBlue, marginBottom: 16, textAlign: 'center' }}>
            XYZ - Find It Nearby
          </Text>
          <Text style={{ fontSize: 16, color: '#666', textAlign: 'center' }}>
            Map preview available only on Expo Go.
          </Text>
          <Text style={{ fontSize: 14, color: '#999', marginTop: 12, textAlign: 'center' }}>
            Scan the QR code in the terminal with Expo Go app to preview the full experience.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.softWhite }}>
        <View style={{ flex: 1 }}>
          <View style={{ paddingHorizontal: 20, paddingTop: 12, paddingBottom: 8, backgroundColor: 'white' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <Text style={{ fontSize: 24, fontWeight: '700', color: colors.deepBlue }}>
                Welcome {user?.firstName}
              </Text>
              <TouchableOpacity
                onPress={handleSignOut}
                style={{ justifyContent: 'center', alignItems: 'center', width: 40, height: 40, borderRadius: 20, backgroundColor: colors.softWhite }}
              >
                <Image source={icons.out} style={{ width: 16, height: 16 }} />
              </TouchableOpacity>
            </View>

            <Searchbar
              placeholder="Search for products..."
              onChangeText={handleSearch}
              value={searchQuery}
              style={{ backgroundColor: colors.softWhite, elevation: 2 }}
              iconColor={colors.deepBlue}
              inputStyle={{ color: colors.deepBlue }}
            />
          </View>

          <View style={{ flex: 1 }}>
            {!hasPermission ? (
              <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color={colors.deepBlue} />
                <Text style={{ marginTop: 12, color: '#666' }}>Loading location...</Text>
              </View>
            ) : (
              <Map stores={stores} selectedStore={selectedStore} />
            )}
          </View>

          {loading ? (
            <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 200, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center' }}>
              <ActivityIndicator size="large" color={colors.deepBlue} />
            </View>
          ) : (
            <ProductBottomSheet
              ref={bottomSheetRef}
              products={products}
              onProductPress={handleProductPress}
              userLatitude={userCoords?.latitude}
              userLongitude={userCoords?.longitude}
            />
          )}
        </View>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

export default Home;
