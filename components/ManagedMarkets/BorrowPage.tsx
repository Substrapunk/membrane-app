// import {
//   Box,
//   Flex,
//   Heading,
//   Text,
//   Button,
//   Tooltip,
//   Table,
//   Thead,
//   Tbody,
//   Tr,
//   Th,
//   Td,
//   VStack,
//   HStack,
//   Spacer,
//   Tag,
//   useColorModeValue,
// } from '@chakra-ui/react';
// import { useRouter } from 'next/router';


// // import Link from "next/link";

// // const filters = [
// //   { label: 'Collateral asset is', value: 'any asset' },
// //   { label: 'Debt asset is', value: 'any asset' },
// //   { label: 'Market is', value: 'any market' },
// // ];

// // const activeFilter = { label: 'Liquidity is', value: '>$100,000' };

// const borrowMarkets = [
//   {
//     slug: "rlp-usr",
//     collateral: { name: "RLP", platform: "Resolv" },
//     debt: { name: "USR", platform: "Resolv" },
//     supplyAPY: "27.84%",
//     borrowAPY: "7.38%",
//     multiplier: "5.69x",
//     lltv: "87.50%",
//     liquidity: "$6.29M",
//   },
//   {
//     slug: "rlp-usdc",
//     collateral: { name: "RLP", platform: "Resolv" },
//     debt: { name: "USDC", platform: "Resolv" },
//     supplyAPY: "27.84%",
//     borrowAPY: "8.93%",
//     multiplier: "5.69x",
//     lltv: "87.50%",
//     liquidity: "$1.08M",
//   },
//   {
//     slug: "rlp-wstusr",
//     collateral: { name: "RLP", platform: "Resolv" },
//     debt: { name: "WSTUSR", platform: "Resolv" },
//     supplyAPY: "27.84%",
//     borrowAPY: "9.73%",
//     multiplier: "5.69x",
//     lltv: "87.50%",
//     liquidity: "$176,958.31",
//   },
//   {
//     slug: "usdopp-wm",
//     collateral: { name: "USD0++", platform: "Euler Yield" },
//     debt: { name: "wM", platform: "Euler Yield" },
//     supplyAPY: "14.08%",
//     borrowAPY: "5.41%",
//     multiplier: "8.31x",
//     lltv: "90.00%",
//     liquidity: "$375,228.74",
//   },
// ];

// const tableData = [
//   {
//     collateral: { name: 'RLP', platform: 'Resolv' },
//     debt: { name: 'USR', platform: 'Resolv' },
//     supplyApy: '27.84%',
//     borrowApy: '7.38%',
//     maxMultiplier: '5.69x',
//     lltv: '87.50%',
//     liquidity: '$6.29M\n6.29M USR',
//   },
//   {
//     collateral: { name: 'RLP', platform: 'Resolv' },
//     debt: { name: 'USDC', platform: 'Resolv' },
//     supplyApy: '27.84%',
//     borrowApy: '8.93%',
//     maxMultiplier: '5.69x',
//     lltv: '87.50%',
//     liquidity: '$1.08M\n1.08M USDC',
//   },
//   {
//     collateral: { name: 'RLP', platform: 'Resolv' },
//     debt: { name: 'WSTUSR', platform: 'Resolv' },
//     supplyApy: '27.84%',
//     borrowApy: '9.73%',
//     maxMultiplier: '5.69x',
//     lltv: '87.50%',
//     liquidity: '$176,958.31\n164,544.46 WSTUSR',
//   },
//   {
//     collateral: { name: 'USDO++', platform: 'Euler Yield' },
//     debt: { name: 'wM', platform: 'Euler Yield' },
//     supplyApy: '14.08%',
//     borrowApy: '5.41%',
//     maxMultiplier: '8.31x',
//     lltv: '90.00%',
//     liquidity: '$375,228.74\n375,228.74 wM',
//   },
// ];


// const filters = [
//   { label: 'Collateral asset is', value: 'any asset' },
//   { label: 'Debt asset is', value: 'any asset' },
//   { label: 'Market is', value: 'any market' },
// ];

// const activeFilter = { label: 'Liquidity is', value: '>$100,000' };


// export default function BorrowPage() {

//   const router = useRouter();

//   const handleRowClick = (slug: string) => {
//     router.push(`/borrow/${slug}`);
//   };

//   return (
//     <Box bg="gray.900" color="white" minH="100vh" p={6}>
//       {/* Header */}
//       <Flex align="center" gap={4} mb={6}>
//         <Box boxSize="50px" bg="teal.500" borderRadius="12px" />
//         <Box>
//           <Heading fontSize="2xl">Borrow</Heading>
//           <Text fontSize="sm" color="gray.400">
//             Borrow against collateral or multiply your exposure by looping or going long and short.
//           </Text>
//         </Box>
//       </Flex>

//       {/* Filters */}
//       {/* <Flex flexWrap="wrap" gap={2} mb={6}>
//         {filters.map((filter, i) => (
//           <Tag key={i} px={4} py={2} borderRadius="full" bg="gray.700" color="gray.100">
//             {filter.label} <Text fontWeight="bold" ml={2}>{filter.value}</Text>
//           </Tag>
//         ))}
//         <Tag px={4} py={2} borderRadius="full" bg="blue.400" color="black" fontWeight="bold">
//           {activeFilter.label} <Text ml={2}>{activeFilter.value}</Text>
//         </Tag>
//         <Button variant="outline" colorScheme="whiteAlpha" borderColor="gray.600">
//           Add Filter
//         </Button>
//       </Flex> */}

//       {/* Stats */}
//       <Flex mb={4}>
//         <Spacer />
//         <VStack align="end" spacing={1}>
//           <Text fontSize="sm" color="gray.400">Total borrow</Text>
//           <Text fontSize="xl" fontWeight="bold">$613.87M</Text>
//         </VStack>
//         <VStack align="end" spacing={1} ml={8}>
//           <Text fontSize="sm" color="gray.400">Total supply</Text>
//           <Text fontSize="xl" fontWeight="bold">$1.31B</Text>
//         </VStack>
//       </Flex>

//       {/* Table */}
//       <Box overflowX="auto" borderRadius="lg" border="1px solid" borderColor="gray.700">
//         <Table variant="simple" size="md">
//           <Thead>
//             <Tr>
//               {[
//                 { label: 'Collateral asset', tooltip: 'Asset used as collateral' },
//                 { label: 'Debt asset', tooltip: 'Asset you borrow' },
//                 { label: 'Supply APY', tooltip: 'Annual % yield earned by suppliers' },
//                 { label: 'Borrow APY', tooltip: 'Annual % cost to borrow' },
//                 { label: 'Max multiplier', tooltip: 'Max leverage on this pair' },
//                 { label: 'LLTV', tooltip: 'Liquidation Loan-To-Value' },
//                 { label: 'Liquidity', tooltip: 'Available liquidity' },
//               ].map(({ label, tooltip }) => (
//                 <Th key={label}>
//                   <Tooltip label={tooltip} hasArrow fontSize="sm">
//                     <Text cursor="help">{label}</Text>
//                   </Tooltip>
//                 </Th>
//               ))}
//             </Tr>
//           </Thead>
//           <Tbody>
//             {borrowMarkets.map((row, i) => (
//               <Tr
//                 key={row.slug}
//                 // as={Link}
//                 // href={`/managed/${row.slug}`}
//                 onClick={() => handleRowClick(row.slug)}
//                 _hover={{ bg: "gray.700" }}
//                 cursor="pointer">
//                 <Td>
//                   <VStack align="start" spacing={0}>
//                     <Text fontWeight="bold">{row.collateral.name}</Text>
//                     <Text fontSize="sm" color="gray.400">{row.collateral.platform}</Text>
//                   </VStack>
//                 </Td>
//                 <Td>
//                   <VStack align="start" spacing={0}>
//                     <Text fontWeight="bold">{row.debt.name}</Text>
//                     <Text fontSize="sm" color="gray.400">{row.debt.platform}</Text>
//                   </VStack>
//                 </Td>
//                 <Td>{row.supplyAPY}</Td>
//                 <Td>{row.borrowAPY}</Td>
//                 <Td>{row.multiplier}</Td>
//                 <Td>{row.lltv}</Td>
//                 <Td>
//                   {row.liquidity.split("\n").map((line, j) => (
//                     <Text key={j} fontSize={j === 0 ? "md" : "sm"} color={j === 0 ? "white" : "gray.400"}>
//                       {line}
//                     </Text>
//                   ))}
//                 </Td>
//               </Tr>
//             ))}
//           </Tbody>
//         </Table>
//       </Box>
//     </Box>
//   );
// }


import { colors } from '@/config/defaults';
import { Card, CardBody, CardFooter, CardHeader, Checkbox, FormControl, FormLabel, HStack, Input, Stack, Text } from '@chakra-ui/react';
import { useEffect, useMemo } from 'react';
import useManagerState, { UpdateOverallMarket } from './hooks/useManagerState';
import { Box, Button, Flex, IconButton } from '@chakra-ui/react';
import { CloseIcon } from '@chakra-ui/icons';
import { useState } from 'react';
import Select from '../Select';
import { on } from 'events';
import { useAssetBySymbol } from '@/hooks/useAssets';

export function WhitelistedAddressInput({
  value,
  onChange,
}: {
  value?: string[] | null;
  onChange: (newList: string[]) => void;
}) {
  const [input, setInput] = useState('');

  const handleAddAddress = () => {
    if (!input.trim()) return;
    const newList = [...(value || []), input.trim()];
    onChange(newList);
    setInput('');
  };

  const handleRemoveAddress = (index: number) => {
    if (!value) return;
    const newList = [...value];
    newList.splice(index, 1); // remove the item
    onChange(newList);
  };

  return (
    <Box>
      <Stack direction="row" mb={2}>
        <Input
          value={input}
          placeholder="Enter address"
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleAddAddress();
            }
          }}
        />
        <Button onClick={handleAddAddress}>Add</Button>
      </Stack>

      <Stack spacing={1}>
        {(value || []).map((addr, idx) => (
          <Flex key={idx} align="center" justify="space-between" bg="gray.50" p={2} borderRadius="md">
            <Text fontSize="sm" color="gray.700" isTruncated maxW="80%">
              {addr}
            </Text>
            <IconButton
              size="sm"
              variant="ghost"
              colorScheme="red"
              aria-label="Remove address"
              icon={<CloseIcon boxSize={8} />}
              justifyContent={'end'}
              marginInlineEnd={"4%"}
              onClick={() => handleRemoveAddress(idx)}
            />
          </Flex>
        ))}
      </Stack>
    </Box>
  );
}

interface MarketCardProps {
  title: string;
  initialData: UpdateOverallMarket;
  onEditCollateral: () => void;
}

export function MarketCard({ title, initialData, onEditCollateral }: MarketCardProps) {
  const { managerState, setManagerState } = useManagerState();
  const [data, setData] = useState<UpdateOverallMarket>(initialData);

  const handleChange = (field: keyof UpdateOverallMarket, value: any) => {
    setData((prev) => ({ ...prev, [field]: value }));
  };

  const isDisabled = useMemo(() => {
    return JSON.stringify(data) === JSON.stringify(initialData);
  }, [initialData, data]);

  return (
    <Card width="400px">
      <CardHeader fontWeight="bold" fontSize="xl">
        {title}
      </CardHeader>

      <CardBody>
        <Stack spacing={4}>
          <FormControl>
            <FormLabel>Manager Fee</FormLabel>
            <Input
              value={data.manager_fee ?? ''}
              placeholder="Enter manager fee"
              onChange={(e) => handleChange('manager_fee', e.target.value)}
            />
          </FormControl>

          <FormControl>
            <FormLabel>Debt Supply Cap</FormLabel>
            <Input
              value={data.debt_supply_cap ?? ''}
              placeholder="Enter debt supply cap"
              onChange={(e) => handleChange('debt_supply_cap', e.target.value)}
            />
          </FormControl>

          <FormControl>
            <FormLabel>Per User Debt Cap</FormLabel>
            <Input
              value={data.per_user_debt_cap ?? ''}
              placeholder="Enter per user debt cap"
              onChange={(e) => handleChange('per_user_debt_cap', e.target.value)}
            />
          </FormControl>

          <FormControl>
            <FormLabel>Whitelisted Debt Suppliers</FormLabel>
            <WhitelistedAddressInput
              value={data.whitelisted_debt_suppliers}
              onChange={(newList) => handleChange('whitelisted_debt_suppliers', newList)}
            />
          </FormControl>

          {data.pause_actions &&
            <Checkbox
              isChecked={data.pause_actions ?? false}
              onChange={(e) => handleChange('pause_actions', e.target.checked)}
            >
              Pause Actions
            </Checkbox>}
        </Stack>
      </CardBody>

      <CardFooter justifyContent="space-between" alignItems="center">
        <Button
          color={colors.tabBG}
          onClick={() => setManagerState({ updateOverallMarket: data })}
          isDisabled={isDisabled}
        >
          <a style={{ color: 'white' }}>Edit</a>
        </Button>
        <Text
          as="button"
          fontSize="sm"
          color="white"
          fontWeight="bold"
          onClick={onEditCollateral}
        >
          Edit collateral →
        </Text>
      </CardFooter>
    </Card>
  );
}


interface WhitelistedCollateralSupplierInputProps {
  value?: string[] | null;
  onChange: (newList: string[]) => void;
}

export function WhitelistedCollateralSupplierInput({
  value,
  onChange,
}: WhitelistedCollateralSupplierInputProps) {
  const [input, setInput] = useState('');

  const handleAddSupplier = () => {
    if (!input.trim()) return;

    const newList = [...(value || []), input.trim()];
    onChange(newList);
    setInput(''); // Clear input after adding
  };

  const handleRemoveSupplier = (index: number) => {
    if (!value) return;

    const newList = [...value];
    newList.splice(index, 1); // Remove the supplier at index
    onChange(newList);
  };

  return (
    <Box>
      <Stack direction="row" mb={2}>
        <Input
          value={input}
          placeholder="Enter collateral supplier address"
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleAddSupplier();
            }
          }}
        />
        <Button onClick={handleAddSupplier}>Add</Button>
      </Stack>

      <Stack spacing={1}>
        {(value || []).map((addr, idx) => (
          <Flex key={idx} align="center" justify="space-between" bg="gray.50" p={2} borderRadius="md">
            <Text fontSize="sm" color="gray.700" isTruncated maxW="80%">
              {addr}
            </Text>
            <IconButton
              size="sm"
              variant="ghost"
              colorScheme="red"
              aria-label="Remove supplier"
              icon={<CloseIcon boxSize={8} />}
              onClick={() => handleRemoveSupplier(idx)}
            />
          </Flex>
        ))}
      </Stack>
    </Box>
  );
}

export type UpdateCollateralParams = {
  collateral_denom: string;
  max_borrow_LTV?: string;
  liquidation_LTV?: any;
  rate_params?: any;
  borrow_fee?: string;
  whitelisted_collateral_suppliers?: string[] | null;
  borrow_cap?: any;
  max_slippage?: string;
  pool_for_oracle_and_liquidations?: any;
};

interface CollateralCardProps {
  options: Option[];
  initialData: UpdateCollateralParams;
  onEditMarket: () => void;
}

interface Option {
  label: string;
  value: string;
}

export function CollateralCard({ options, initialData, onEditMarket }: CollateralCardProps) {
  const { managerState, setManagerState } = useManagerState();
  const [data, setData] = useState<UpdateCollateralParams>(initialData);
  const [selectedCollateral, setSelectedCollateral] = useState(options[0] || '');

  const handleChange = (field: keyof UpdateCollateralParams, value: any) => {
    setData((prev) => ({ ...prev, [field]: value }));
  };

  const isDisabled = useMemo(() => {
    return JSON.stringify(data) === JSON.stringify(initialData);
  }, [initialData, data]);

  useEffect(() => {
    //Find the selectedCollateral 
    const asset = useAssetBySymbol(selectedCollateral.label)
    if (asset) {
      setData((prev) => ({
        ...prev,
        collateral_denom: asset.base,
      }));
    }
  }, [selectedCollateral]);


  return (
    <Card width="400px">
      <CardHeader>
        <FormControl>
          <FormLabel>Collateral</FormLabel>
          <Select
            value={selectedCollateral}
            onChange={(e) => setSelectedCollateral(e.target.value)}
            options={options}
          />
        </FormControl>
      </CardHeader>

      <CardBody>
        <Stack spacing={4}>
          <FormControl>
            <FormLabel>Max Borrow LTV</FormLabel>
            <Input
              value={data.max_borrow_LTV ?? ''}
              placeholder="Enter max borrow LTV"
              onChange={(e) => handleChange('max_borrow_LTV', e.target.value)}
            />
          </FormControl>

          <FormControl>
            <FormLabel>Borrow Fee</FormLabel>
            <Input
              value={data.borrow_fee ?? ''}
              placeholder="Enter borrow fee"
              onChange={(e) => handleChange('borrow_fee', e.target.value)}
            />
          </FormControl>

          {/* You can add similar inputs for max_slippage, liquidation_LTV, etc. */}
          <FormControl>
            <FormLabel>Whitelisted Collateral Suppliers</FormLabel>
            <WhitelistedCollateralSupplierInput
              value={data.whitelisted_collateral_suppliers}
              onChange={(newList) => handleChange('whitelisted_collateral_suppliers', newList)}
            />
          </FormControl>

        </Stack>
      </CardBody>

      <CardFooter justifyContent="space-between" alignItems="center">
        <Button
          color={colors.tabBG}
          onClick={() => setManagerState({ updateCollateralParams: data })}
          isDisabled={isDisabled}>
          <a style={{ color: 'white' }}>Edit</a>
        </Button>
        <Text
          as="button"
          fontSize="sm"
          color="white"
          fontWeight="bold"
          onClick={onEditMarket}
        >
          ← Edit market
        </Text>
      </CardFooter>
    </Card>
  );
}


export default function ManagePage() {

  const handleEditCollateral = () => {
    console.log('Swapping to edit collateral view...');
    // You can implement the view swap here
  };
  const handleEditMarket = () => {
    console.log('Swapping to edit market view...');
    // You can implement the view swap here
  };

  const options: Option[] = [
    { label: 'RLP', value: 'RLP' },
    { label: 'USDC', value: 'USDC' },
    { label: 'WSTUSR', value: 'WSTUSR' },
    { label: 'wM', value: 'wM' },
  ]

  const asset = useAssetBySymbol(options[0].label ?? '')
  if (asset) {
    setData((prev) => ({
      ...prev,
      collateral_denom: asset.base,
    }));
  }

  const defaultUpdateOverallMarket: UpdateOverallMarket = {
    pause_actions: false,
    manager_fee: '',
    whitelisted_debt_suppliers: [],
    debt_supply_cap: '',
    per_user_debt_cap: ''
  };

  return (
    <HStack spacing={4} direction="row" align="stretch">
      <Box p={8}>
        <MarketCard
          title="CULTivate"
          initialData={defaultUpdateOverallMarket}
          onEditCollateral={handleEditCollateral}
        />
      </Box>
      <Box p={8}>
        <CollateralCard
          options={options}
          initialData={
            { collateral_denom: asset?.base ?? '' }
          }
          onEditMarket={handleEditMarket}
        />
      </Box>
    </HStack>
  );
}
