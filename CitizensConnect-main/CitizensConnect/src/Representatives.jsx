import React, { useState, useMemo } from "react";
import {
  nationalLeaders,
  stateGovernments,
  unionTerritories,
  majorParties,
  getStatesByRulingParty,
  getStatesByAlliance
} from "./data/IndianPoliticalData";
import {
  Users,
  MapPin,
  Building2,
  Crown,
  Search,
  Filter,
  ChevronDown,
  ExternalLink,
  Flag,
  Award
} from "lucide-react";
import "./Representatives.css";

const TABS = {
  NATIONAL: 'national',
  STATES: 'states',
  UNION_TERRITORIES: 'union_territories',
  PARTIES: 'parties'
};

const ALLIANCES = ['NDA', 'INDIA', 'None'];

export default function Representatives() {
  const [activeTab, setActiveTab] = useState(TABS.NATIONAL);
  const [searchTerm, setSearchTerm] = useState('');
  const [allianceFilter, setAllianceFilter] = useState('all');
  const [partyFilter, setPartyFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  // Filter states based on search and filters
  const filteredStates = useMemo(() => {
    return stateGovernments.filter(state => {
      const matchesSearch = state.state.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          state.chiefMinister.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          state.rulingParty.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesAlliance = allianceFilter === 'all' || state.alliance === allianceFilter;
      const matchesParty = partyFilter === 'all' ||
                          state.rulingParty.toLowerCase().includes(partyFilter.toLowerCase());

      return matchesSearch && matchesAlliance && matchesParty;
    });
  }, [searchTerm, allianceFilter, partyFilter]);

  // Filter union territories based on search
  const filteredUnionTerritories = useMemo(() => {
    return unionTerritories.filter(ut => {
      return ut.territory.toLowerCase().includes(searchTerm.toLowerCase()) ||
             ut.administrator.toLowerCase().includes(searchTerm.toLowerCase()) ||
             ut.rulingParty.toLowerCase().includes(searchTerm.toLowerCase());
    });
  }, [searchTerm]);

  // Filter parties based on search
  const filteredParties = useMemo(() => {
    return majorParties.filter(party => {
      return party.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
             party.abbreviation.toLowerCase().includes(searchTerm.toLowerCase()) ||
             party.leader.toLowerCase().includes(searchTerm.toLowerCase());
    });
  }, [searchTerm]);

  const renderNationalLeaders = () => (
    <div className="representatives-section">
      <div className="section-header">
        <h3 className="section-title">
          <Crown size={24} />
          National Leaders
        </h3>
        <p className="section-subtitle">Key political figures at the national level</p>
      </div>

      <div className="national-leaders-grid">
        {nationalLeaders.map((leader, idx) => (
          <div className="national-leader-card" key={idx}>
            <div className="leader-image-container">
              <img
                src={leader.imageUrl}
                alt={leader.name}
                className="leader-image"
                onError={(e) => {
                  e.target.src = `https://via.placeholder.com/120x120/6a47f2/ffffff?text=${leader.name.charAt(0)}`;
                }}
              />
            </div>
            <div className="leader-info">
              <h4 className="leader-name">{leader.name}</h4>
              <div className="leader-party">{leader.party}</div>
              <div className="leader-role">{leader.role}</div>
              <a
                href={leader.profileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="leader-link"
              >
                <ExternalLink size={14} />
                View Profile
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderStateGovernments = () => (
    <div className="representatives-section">
      <div className="section-header">
        <h3 className="section-title">
          <MapPin size={24} />
          State Governments
        </h3>
        <p className="section-subtitle">Chief Ministers, Governors, and ruling parties of all Indian states</p>
      </div>

      {/* Filters */}
      <div className="filters-section">
        <div className="search-bar">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search states, leaders, or parties..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <button
          className="filter-toggle"
          onClick={() => setShowFilters(!showFilters)}
        >
          <Filter size={18} />
          Filters
          <ChevronDown size={16} className={showFilters ? 'rotated' : ''} />
        </button>

        {showFilters && (
          <div className="filter-options">
            <select
              value={allianceFilter}
              onChange={(e) => setAllianceFilter(e.target.value)}
            >
              <option value="all">All Alliances</option>
              {ALLIANCES.map(alliance => (
                <option key={alliance} value={alliance}>{alliance}</option>
              ))}
            </select>

            <select
              value={partyFilter}
              onChange={(e) => setPartyFilter(e.target.value)}
            >
              <option value="all">All Parties</option>
              {[...new Set(stateGovernments.map(s => s.rulingParty))].map(party => (
                <option key={party} value={party}>{party}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      <div className="states-grid">
        {filteredStates.map((state, idx) => (
          <div className="state-card" key={idx}>
            <div className="state-header">
              <div className="state-flag">{state.flag}</div>
              <div className="state-info">
                <h4 className="state-name">{state.state}</h4>
                <div className="state-code">{state.stateCode}</div>
              </div>
            </div>

            <div className="state-details">
              <div className="ruling-info">
                <div className="ruling-party">
                  <Award size={16} />
                  <strong>{state.rulingParty}</strong>
                </div>
                <div className="alliance-badge">{state.alliance}</div>
              </div>

              <div className="opposition-info">
                <span className="label">Opposition:</span>
                <span>{state.oppositionParty}</span>
              </div>

              <div className="key-leaders">
                <div className="leader-item">
                  <Users size={14} />
                  <span><strong>CM:</strong> {state.chiefMinister}</span>
                </div>
                <div className="leader-item">
                  <Crown size={14} />
                  <span><strong>Gov:</strong> {state.governor}</span>
                </div>
              </div>

              <div className="state-capital">
                <MapPin size={14} />
                <span>Capital: {state.capital}</span>
              </div>
            </div>

            <div className="state-leaders-list">
              {state.leaders.map((leader, leaderIdx) => (
                <div key={leaderIdx} className="leader-item">
                  <div className="leader-image-container">
                    <img
                      src={leader.imageUrl}
                      alt={`${leader.name}`}
                      className="leader-image-small"
                      onError={(e) => {
                        e.target.src = `https://via.placeholder.com/60x60/6a47f2/ffffff?text=${leader.name.charAt(0)}`;
                      }}
                    />
                  </div>
                  <div className="leader-info-small">
                    <div className="leader-name-small">{leader.name}</div>
                    <div className="leader-role-small">{leader.role}</div>
                    <a
                      href={leader.profileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="leader-link-small"
                    >
                      <ExternalLink size={12} />
                      Profile
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {filteredStates.length === 0 && (
        <div className="no-results">
          <Search size={48} />
          <h3>No states found</h3>
          <p>Try adjusting your search or filters</p>
        </div>
      )}
    </div>
  );

  const renderUnionTerritories = () => (
    <div className="representatives-section">
      <div className="section-header">
        <h3 className="section-title">
          <Building2 size={24} />
          Union Territories
        </h3>
        <p className="section-subtitle">Administrators and leaders of Indian union territories</p>
      </div>

      <div className="search-bar" style={{marginBottom: '24px'}}>
        <Search size={18} />
        <input
          type="text"
          placeholder="Search union territories..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="union-territories-grid">
        {filteredUnionTerritories.map((ut, idx) => (
          <div className="union-territory-card" key={idx}>
            <div className="ut-header">
              <h4 className="ut-name">{ut.territory}</h4>
              <div className="ut-capital">Capital: {ut.capital}</div>
            </div>

            <div className="ut-details">
              <div className="ruling-party">
                <Award size={16} />
                <strong>{ut.rulingParty}</strong>
              </div>

              <div className="administrator">
                <Users size={14} />
                <span><strong>Administrator:</strong> {ut.administrator}</span>
              </div>

              <div className="ut-leaders">
                {ut.leaders.map((leader, leaderIdx) => (
                  <div key={leaderIdx} className="leader-item">
                    <div className="leader-image-container">
                      <img
                        src={leader.imageUrl}
                        alt={`${leader.name}`}
                        className="leader-image-small"
                        onError={(e) => {
                          e.target.src = `https://via.placeholder.com/60x60/6a47f2/ffffff?text=${leader.name.charAt(0)}`;
                        }}
                      />
                    </div>
                    <div className="leader-info-small">
                      <div className="leader-role-small">{leader.role}</div>
                      <div className="leader-name-small">{leader.name}</div>
                      <a
                        href={leader.profileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="leader-link-small"
                      >
                        <ExternalLink size={12} />
                        Profile
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredUnionTerritories.length === 0 && (
        <div className="no-results">
          <Search size={48} />
          <h3>No union territories found</h3>
          <p>Try adjusting your search</p>
        </div>
      )}
    </div>
  );

  const renderMajorParties = () => (
    <div className="representatives-section">
      <div className="section-header">
        <h3 className="section-title">
          <Flag size={24} />
          Major Political Parties
        </h3>
        <p className="section-subtitle">National political parties and their current parliamentary strength</p>
      </div>

      <div className="search-bar" style={{marginBottom: '24px'}}>
        <Search size={18} />
        <input
          type="text"
          placeholder="Search parties or leaders..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="parties-grid">
        {filteredParties.map((party, idx) => (
          <div className="party-card" key={idx}>
            <div className="party-header">
              <div
                className="party-color"
                style={{ backgroundColor: party.color }}
              ></div>
              <div className="party-info">
                <h4 className="party-name">{party.name}</h4>
                <div className="party-abbrev">({party.abbreviation})</div>
              </div>
            </div>

            <div className="party-details">
              <div className="party-leader">
                <Users size={14} />
                <span><strong>Leader:</strong> {party.leader}</span>
              </div>

              <div className="party-founded">
                <Award size={14} />
                <span><strong>Founded:</strong> {party.founded}</span>
              </div>

              <div className="party-alliance">
                <Flag size={14} />
                <span><strong>Alliance:</strong> {party.alliance}</span>
              </div>

              <div className="party-seats">
                <div className="seats-info">
                  <span className="lok-sabha">Lok Sabha: {party.seats.lokSabha}</span>
                  <span className="rajya-sabha">Rajya Sabha: {party.seats.rajyaSabha}</span>
                </div>
              </div>

              <div className="party-symbol">
                <span><strong>Symbol:</strong> {party.symbol}</span>
              </div>

              <a
                href={party.website}
                target="_blank"
                rel="noopener noreferrer"
                className="party-website"
              >
                <ExternalLink size={14} />
                Official Website
              </a>
            </div>
          </div>
        ))}
      </div>

      {filteredParties.length === 0 && (
        <div className="no-results">
          <Search size={48} />
          <h3>No parties found</h3>
          <p>Try adjusting your search</p>
        </div>
      )}
    </div>
  );

  return (
    <section className="representatives-container">
      <div className="representatives-header">
        <h1 className="main-title">Indian Political Representatives</h1>
        <p className="main-subtitle">
          Complete information about India's political leaders, state governments, and major political parties
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="tabs-container">
        {Object.entries(TABS).map(([key, value]) => (
          <button
            key={key}
            className={`tab-button ${activeTab === value ? 'active' : ''}`}
            onClick={() => setActiveTab(value)}
          >
            {key.replace('_', ' ')}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        {activeTab === TABS.NATIONAL && renderNationalLeaders()}
        {activeTab === TABS.STATES && renderStateGovernments()}
        {activeTab === TABS.UNION_TERRITORIES && renderUnionTerritories()}
        {activeTab === TABS.PARTIES && renderMajorParties()}
      </div>
    </section>
  );
}
