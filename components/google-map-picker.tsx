"use client";

import { AimOutlined, EnvironmentOutlined } from "@ant-design/icons";
import { Alert, Button, Input, InputNumber, Space, Typography } from "antd";
import { useCallback, useEffect, useRef, useState } from "react";

const { Text } = Typography;

type PickedLocation = {
  label?: string;
  latitude?: number;
  longitude?: number;
};

type GoogleMapPickerProps = {
  value: PickedLocation;
  onChange: (value: PickedLocation) => void;
};

const GOOGLE_MAPS_SCRIPT_ID = "forge-google-maps-script";
const DEFAULT_CENTER = { lat: 0.3476, lng: 32.5825 };

declare global {
  interface Window {
    google?: any;
    forgeGoogleMapsReady?: () => void;
  }
}

function loadGoogleMapsScript(apiKey: string) {
  if (window.google?.maps) return Promise.resolve();

  const existing = document.getElementById(GOOGLE_MAPS_SCRIPT_ID);
  if (existing) {
    return new Promise<void>((resolve) => {
      window.forgeGoogleMapsReady = () => resolve();
    });
  }

  return new Promise<void>((resolve, reject) => {
    window.forgeGoogleMapsReady = () => resolve();
    const script = document.createElement("script");
    script.id = GOOGLE_MAPS_SCRIPT_ID;
    script.async = true;
    script.defer = true;
    script.onerror = () => reject(new Error("Google Maps failed to load"));
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&callback=forgeGoogleMapsReady`;
    document.head.appendChild(script);
  });
}

export function GoogleMapPicker({ value, onChange }: GoogleMapPickerProps) {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const [mapError, setMapError] = useState<string | null>(null);
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  const updatePin = useCallback(
    (latitude: number, longitude: number) => {
      const next = { ...value, latitude, longitude };
      onChange(next);

      if (window.google?.maps && mapInstanceRef.current) {
        const position = { lat: latitude, lng: longitude };
        markerRef.current?.setPosition(position);
        mapInstanceRef.current.panTo(position);
      }
    },
    [onChange, value],
  );

  useEffect(() => {
    if (!apiKey || !mapRef.current) return;

    let cancelled = false;
    loadGoogleMapsScript(apiKey)
      .then(() => {
        if (cancelled || !mapRef.current || !window.google?.maps) return;

        const center =
          value.latitude && value.longitude
            ? { lat: value.latitude, lng: value.longitude }
            : DEFAULT_CENTER;

        const map = new window.google.maps.Map(mapRef.current, {
          center,
          zoom: value.latitude && value.longitude ? 15 : 11,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: false,
        });
        const marker = new window.google.maps.Marker({
          map,
          position: center,
          draggable: true,
        });

        marker.addListener("dragend", () => {
          const position = marker.getPosition();
          if (position) updatePin(position.lat(), position.lng());
        });

        map.addListener("click", (event: any) => {
          if (event.latLng) updatePin(event.latLng.lat(), event.latLng.lng());
        });

        mapInstanceRef.current = map;
        markerRef.current = marker;
      })
      .catch((error: Error) => setMapError(error.message));

    return () => {
      cancelled = true;
    };
  }, [apiKey, updatePin, value.latitude, value.longitude]);

  const useCurrentLocation = () => {
    if (!navigator.geolocation) {
      setMapError("Geolocation is not available in this browser");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => updatePin(position.coords.latitude, position.coords.longitude),
      () => setMapError("Unable to read your current location"),
      { enableHighAccuracy: true, timeout: 10000 },
    );
  };

  return (
    <Space direction="vertical" size={8} className="full-width">
      <Input
        prefix={<EnvironmentOutlined />}
        placeholder="Property address or location label"
        value={value.label}
        onChange={(event) => onChange({ ...value, label: event.target.value })}
      />

      {apiKey ? (
        <div className="map-picker" ref={mapRef} />
      ) : (
        <Alert
          type="info"
          showIcon
          message="Google Maps key not configured"
          description="Set NEXT_PUBLIC_GOOGLE_MAPS_API_KEY to enable the clickable map. You can still enter an address and use current location."
        />
      )}

      {mapError ? <Alert type="warning" showIcon message={mapError} /> : null}

      <Space wrap>
        <Button icon={<AimOutlined />} onClick={useCurrentLocation}>
          Use current location
        </Button>
        <Text type="secondary">Click the map or drag the pin to mark the property.</Text>
      </Space>

      <div className="coordinate-grid">
        <InputNumber
          placeholder="Latitude"
          value={value.latitude}
          onChange={(next) =>
            onChange({ ...value, latitude: next === null ? undefined : Number(next) })
          }
        />
        <InputNumber
          placeholder="Longitude"
          value={value.longitude}
          onChange={(next) =>
            onChange({ ...value, longitude: next === null ? undefined : Number(next) })
          }
        />
      </div>
    </Space>
  );
}
