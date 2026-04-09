import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { states, type PollingStation } from "@/data/indiaData";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MapPin, Search, LogIn } from "lucide-react";

const PollingStationSelection = () => {
  const navigate = useNavigate();
  const [selectedState, setSelectedState] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedConstituency, setSelectedConstituency] = useState("");
  const [selectedStation, setSelectedStation] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const stateObj = useMemo(
    () => states.find((s) => s.name === selectedState),
    [selectedState]
  );

  const districts = useMemo(() => stateObj?.districts ?? [], [stateObj]);

  const districtObj = useMemo(
    () => districts.find((d) => d.name === selectedDistrict),
    [districts, selectedDistrict]
  );

  const constituencies = useMemo(
    () => districtObj?.constituencies ?? [],
    [districtObj]
  );

  const constituencyObj = useMemo(
    () => constituencies.find((c) => c.name === selectedConstituency),
    [constituencies, selectedConstituency]
  );

  const pollingStations: PollingStation[] = constituencyObj?.pollingStations ?? [];

  const filteredStations = useMemo(() => {
    if (!searchQuery.trim()) return pollingStations;
    const q = searchQuery.toLowerCase();
    return pollingStations.filter(
      (ps) =>
        ps.name.toLowerCase().includes(q) ||
        ps.location.toLowerCase().includes(q) ||
        String(ps.number).includes(q)
    );
  }, [pollingStations, searchQuery]);

  const handleStateChange = (value: string) => {
    setSelectedState(value);
    setSelectedDistrict("");
    setSelectedConstituency("");
    setSelectedStation(null);
    setSearchQuery("");
  };

  const handleDistrictChange = (value: string) => {
    setSelectedDistrict(value);
    setSelectedConstituency("");
    setSelectedStation(null);
    setSearchQuery("");
  };

  const handleConstituencyChange = (value: string) => {
    setSelectedConstituency(value);
    setSelectedStation(null);
    setSearchQuery("");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b-4 border-primary bg-primary">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6">
          <h1 className="font-heading text-2xl sm:text-3xl font-bold text-primary-foreground text-center tracking-tight">
            Election Commission of India
          </h1>
          <p className="font-heading text-base sm:text-lg text-primary-foreground/90 text-center mt-1 font-medium">
            Polling Station Selection (2026)
          </p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6">
        {/* Filter Section */}
        <div className="border border-border bg-card p-6 mb-8 shadow-sm">
          <h2 className="font-heading text-lg font-semibold text-foreground mb-5 border-b border-border pb-3">
            Select Location
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {/* State */}
            <div>
              <label className="block font-heading text-sm font-bold text-foreground mb-2">
                Select State
              </label>
              <Select value={selectedState} onValueChange={handleStateChange}>
                <SelectTrigger>
                  <SelectValue placeholder="-- Choose State / UT --" />
                </SelectTrigger>
                <SelectContent className="max-h-60">
                  {states.map((s) => (
                    <SelectItem key={s.name} value={s.name}>
                      {s.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* District */}
            <div>
              <label className="block font-heading text-sm font-bold text-foreground mb-2">
                Select District
              </label>
              <Select
                value={selectedDistrict}
                onValueChange={handleDistrictChange}
                disabled={!selectedState}
              >
                <SelectTrigger>
                  <SelectValue placeholder="-- Choose District --" />
                </SelectTrigger>
                <SelectContent className="max-h-60">
                  {districts.map((d) => (
                    <SelectItem key={d.name} value={d.name}>
                      {d.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Assembly Constituency */}
            <div>
              <label className="block font-heading text-sm font-bold text-foreground mb-2">
                Select Assembly Constituency
              </label>
              <Select
                value={selectedConstituency}
                onValueChange={handleConstituencyChange}
                disabled={!selectedDistrict}
              >
                <SelectTrigger>
                  <SelectValue placeholder="-- Choose Constituency --" />
                </SelectTrigger>
                <SelectContent className="max-h-60">
                  {constituencies.map((c) => (
                    <SelectItem key={c.name} value={c.name}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Polling Stations */}
        {selectedConstituency ? (
          <div className="border border-border bg-card shadow-sm">
            <div className="p-6 border-b border-border flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h2 className="font-heading text-lg font-semibold text-foreground flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-primary" />
                  Polling Stations — {selectedConstituency}
                </h2>
                <p className="font-body text-sm text-muted-foreground mt-1">
                  {filteredStations.length} station{filteredStations.length !== 1 ? "s" : ""} found. Select a polling station to proceed.
                </p>
              </div>
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search stations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            <div className="max-h-[400px] overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="font-heading font-bold w-20">Polling Station No</TableHead>
                    <TableHead className="font-heading font-bold">Polling Station Name</TableHead>
                    <TableHead className="font-heading font-bold">Location</TableHead>
                    <TableHead className="font-heading font-bold w-20 text-center">Select</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStations.length > 0 ? (
                    filteredStations.map((ps) => (
                      <TableRow
                        key={ps.number}
                        className={`cursor-pointer transition-colors ${
                          selectedStation === ps.number
                            ? "bg-primary/10"
                            : ""
                        }`}
                        onClick={() => setSelectedStation(ps.number)}
                      >
                        <TableCell className="font-body font-medium">{ps.number}</TableCell>
                        <TableCell className="font-body">{ps.name}</TableCell>
                        <TableCell className="font-body text-muted-foreground">{ps.location}</TableCell>
                        <TableCell className="text-center">
                          <input
                            type="radio"
                            name="polling-station"
                            checked={selectedStation === ps.number}
                            onChange={() => setSelectedStation(ps.number)}
                            className="h-4 w-4 accent-primary cursor-pointer"
                          />
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                        No polling stations match your search.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Enter button */}
            <div className="p-6 flex justify-end border-t border-border">
              <Button
                disabled={selectedStation === null}
                onClick={() =>
                  navigate("/polling-station-details", {
                    state: {
                      stateName: selectedState,
                      district: selectedDistrict,
                      constituency: selectedConstituency,
                      stationNumber: selectedStation,
                      stationName: pollingStations.find((p) => p.number === selectedStation)?.name,
                      stationLocation: pollingStations.find((p) => p.number === selectedStation)?.location,
                    },
                  })
                }
                className="font-heading font-semibold tracking-wide gap-2 px-8"
              >
                <LogIn className="h-4 w-4" />
                Enter
              </Button>
            </div>
          </div>
        ) : (
          <div className="border border-border bg-card p-16 flex flex-col items-center justify-center text-center shadow-sm">
            <MapPin className="h-12 w-12 text-muted-foreground/40 mb-4" />
            <p className="font-heading text-lg text-muted-foreground">
              Select a State, District and Assembly Constituency to view polling stations
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default PollingStationSelection;
